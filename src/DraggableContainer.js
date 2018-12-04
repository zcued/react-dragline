import React from 'react'
import PropTypes from 'prop-types'
import { unique, checkArrayWithPush } from './utils'


export default class DraggableContainer extends React.PureComponent {
  $ = null // container HTMLElement

  static propTypes = {
    Container: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    style: PropTypes.object,
    directions: PropTypes.array,
    threshold: PropTypes.number,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    limit: PropTypes.bool,
    lineStyle: PropTypes.object,
  }

  static defaultProps = {
    Container: 'div',
    style: {},
    directions: ['tt', 'bb', 'll', 'rr', 'tb', 'lr' ],
    threshold: 5,
    className: '',
    activeClassName: 'active',
    limit: true,
    lineStyle: {},
  }

  constructor(props) {
    super(props)

    this.state = {
      vIndices: [],
      hIndices: [],
      vLine: [],
      hLine: [],
      static: false,
    }
  }

  componentDidMount() {
    this.checkContainerPosition()
  }

  // 拖拽初始时 计算出所有元素的坐标信息，存储于this.$children
  initChildrenCoordinate = () => {
    this.$children = this.props.children.map(({props}, i) => {
      const $ = this.$.childNodes[i]
      const {x, y} = props.position
      const w = $.clientWidth
      const h = $.clientHeight

      return {
        $,
        i,
        x,
        y,
        w,
        h,
        l: x,
        r: x + w,
        t: y,
        b: y + h,
        lr: x + w / 2,
        tb: y + h / 2,
      }
    })
  }

  // 拖动中计算是否吸附/显示辅助线
  calcNewPosition = (index) => {
    return (x, y) => {
      const target = this.$children[index]
      const compares = this.$children.filter((_, i) => i !== index)

      if (this.props.limit) {
        const {limitX, limitY} = this.checkDragOut({x, y}, target)
        x = limitX
        y = limitY
      }

      return {
        x: this.compareNear({x, y}, compares, target, 'x'),
        y: this.compareNear({x, y}, compares, target, 'y'),
      }
    }
  }

  resetDragState = () => {
    this.setState({vLine: [], hLine: [], vIndices: [], hIndices: []})
  }

  getMaxDistance = (arr) => {
    const num = arr.sort((a, b) => a - b)
    return num[num.length - 1] - num[0]
  }

  // 检查是否拖出容器
  checkDragOut({x, y}, target) {
    const maxLeft = this.$.clientWidth - target.w
    const maxTop = this.$.clientHeight - target.h
    let limitX = x
    let limitY = y

    if (x < 0) {
      limitX = 0
    } else if (x > maxLeft) {
      limitX = maxLeft
    }

    if (y < 0) {
      limitY = 0
    } if (y > maxTop) {
      limitY = maxTop
    }

    return {limitX, limitY}
  }

  // 检查容器是否有定位属性
  checkContainerPosition() {
    const position = window.getComputedStyle(this.$, null).getPropertyValue('position')
    if (position === 'static') {
      console.error(
        'Warning: The `position` attribute of container is `static`! It may cause an error if you render in server-side.',
      )
      this.setState({static: true})
    }
  }

  parseStyle() {
    return this.state.static
      ? {...this.props.style, position: 'relative'}
      : this.props.style
  }

  /**
   * lowerCase => compare
   * upperCase => target
   */
  compareNearSingle({x, y}, dire, {l, r, t, b, lr, tb}, target, key) {
    const
      $ = target.$,
      W = target.w,
      H = target.h,

      // T = y,
      // B = y + H,
      // L = x,
      // R = x + W

      // optimize: x, y 为拖拽预期值，并非真实坐标。依据x,y计算辅助线的长度，在xy辅助线交汇时会有一定的偏差、
      T = $.offsetTop,
      B = $.offsetTop + H,
      L = $.offsetLeft,
      R = $.offsetLeft + W


    const paramsForLine = {
      x: [t, b, T, B],
      y: [l, r, L, R],
    }

    const result = {
      // 距离是否达到吸附阈值
      near: false,
      // 距离差
      dist: Number.MAX_SAFE_INTEGER,
      // 辅助线坐标
      value: 0,
      // 辅助线长度
      length: this.getMaxDistance(paramsForLine[key]),
      // 辅助线起始坐标（对应绝对定位的top/left）
      origin: Math.min(...paramsForLine[key]),
    }

    if (!this.props.directions.includes(dire)) {
      return result
    }

    switch (dire) {
      case 'lr':
        result.dist = x + W / 2 - lr
        result.value = lr
        break
      case 'll':
        result.dist = x - l
        result.value = l
        break
      case 'rr':
        result.dist = x + W - r
        result.value = r
        break
      case 'tt':
        result.dist = y - t
        result.value = t
        break
      case 'bb':
        result.dist = y + H - b
        result.value = b
        break
      case 'tb':
        result.dist = y + H / 2 - tb
        result.value = tb
        break
    }

    if (Math.abs(result.dist) < this.props.threshold + 1) {
      result.near = true
      return result
    }

    return result
  }

  compareNear(values, compares, target, key) {
    const diffs = {
      lineState: {
        x: 'vLine',
        y: 'hLine',
      },
      indices: {
        x: 'vIndices',
        y: 'hIndices',
      },
      directions: {
        x: ['ll', 'rr', 'lr'],
        y: ['tt', 'bb', 'tb'],
      },
    }

    const lineState = diffs.lineState[key]
    const directions = diffs.directions[key]
    const indices = diffs.indices[key]

    /**
     * results: {
     *   distance1: [{i, value, origin, length}],
     *   distance2: [{i, value, origin, length}],
     * }
     * distance: 与需要显示辅助线坐标的距离
     */
    const results = {}

    compares.forEach((compare) => {
      directions.forEach(dire => {
        const {near, dist, value, origin, length} = this.compareNearSingle(values, dire, compare, target, key)
        if (near) {
          checkArrayWithPush(results, dist, {i: compare.i, value, origin, length})
        }
      })
    })

    const resultArray = Object.entries(results)
    if (resultArray.length) {
      // 多个元素符合阈值时， 排序 => 取最小
      const [minDistance, lines] = resultArray.sort(([dist1], [dist2]) => Math.abs(dist1) - Math.abs(dist2))[0]
      this.setState({
        [lineState]: lines,
        [indices]: unique(lines.map(({i}) => i)),
      })
      return values[key] - minDistance
    } else {
      this.setState({
        [lineState]: [],
        [indices]: [],
      })
      return values[key]
    }
  }

  _renderGuideLine() {
    const { vLine, hLine } = this.state
    const { lineStyle } = this.props
    const commonStyle = {
      position: 'absolute',
      backgroundColor: '#FF00CC',
      ...lineStyle,
    }

    return (
      <React.Fragment>
        {vLine.map(({length, value, origin}, i) => (
          <span
            key={`v-${i}`}
            style={{ left: value, top: origin, height: length, width: 1, ...commonStyle }}
          />
        ))}
        {hLine.map(({length, value, origin}, i) => (
          <span
            key={`h-${i}`}
            style={{ top: value, left: origin, width: length, height: 1, ...commonStyle }}
          />
        ))}
      </React.Fragment>
    )
  }

  render() {
    const { Container, activeClassName } = this.props
    const { vIndices, hIndices } = this.state
    return (
      <Container style={this.parseStyle()} ref={ref => this.$ = ref}>
        {this.props.children.map((child, index) => React.cloneElement(child, {
          onStart: this.initChildrenCoordinate,
          onDrag: this.calcNewPosition(index),
          onStop: this.resetDragState,
          active: vIndices.concat(hIndices).includes(index),
          activeClassName,
        }))}
        {this._renderGuideLine()}
      </Container>
    )
  }
}
