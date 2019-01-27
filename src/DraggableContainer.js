import React from 'react'
import PropTypes from 'prop-types'
import { unique, checkArrayWithPush, getMaxDistance } from './utils'


export default class DraggableContainer extends React.Component {
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
      indices: [],
      vLines: [],
      hLines: [],
      static: false,
    }
  }

  componentDidMount() {
    this.checkContainerPosition()
  }

  // 拖拽初始时 计算出所有元素的坐标信息，存储于this.$children
  initialize = () => {
    this.$children = this.props.children.map((child, i) => {
      const $ = this.$.childNodes[i]
      const x = Number($.getAttribute('data-x'))
      const y = Number($.getAttribute('data-y'))
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
  calc = (index) => {
    return (x, y) => {
      const target = this.$children[index]
      const compares = this.$children.filter((_, i) => i !== index)

      if (this.props.limit) {
        const { limitX, limitY } = this.checkDragOut({ x, y }, target)
        x = limitX
        y = limitY
      }

      return this.calcAndDrawLines({ x, y }, target, compares)
    }
  }

  reset = () => {
    this.setState({ vLines: [], hLines: [], indices: [] })
  }

  /**
   * @param {Object} values xy坐标
   * @param {Object} target 拖拽目标
   * @param {Array} compares 对照组
   */
  calcAndDrawLines(values, target, compares) {
    const { v: x, indices: indices_x, lines: vLines } = this.calcPosValues(values, target, compares, 'x')
    const { v: y, indices: indices_y, lines: hLines } = this.calcPosValues(values, target, compares, 'y')

    const indices = unique(indices_x.concat(indices_y))

    // https://github.com/zcued/react-drag-guideline/issues/9
    if (vLines.length && hLines.length) {
      vLines.forEach(line => {
        const compare = compares.find(({ i }) => i === line.i)
        const { length, origin } = this.calcLineValues({ x, y }, target, compare, 'x')

        line.length = length
        line.origin = origin
      })


      hLines.forEach(line => {
        const compare = compares.find(({ i }) => i === line.i)
        const { length, origin } = this.calcLineValues({ x, y }, target, compare, 'y')

        line.length = length
        line.origin = origin
      })
    }

    this.setState({
      vLines,
      hLines,
      indices,
    })

    return { x, y }
  }

  calcLineValues(values, target, compare, key) {
    const { x, y } = values
    const { h: H, w: W } = target
    const { l, r, t, b } = compare
    const
      T = y,
      B = y + H,
      L = x,
      R = x + W

    const direValues = {
      x: [t, b, T, B],
      y: [l, r, L, R],
    }

    const length = getMaxDistance(direValues[key])
    const origin = Math.min(...direValues[key])
    return { length, origin }
  }

  calcPosValues(values, target, compares, key) {
    const results = {}

    const directions = {
      x: ['ll', 'rr', 'lr'],
      y: ['tt', 'bb', 'tb'],
    }

    // filter unnecessary directions
    const validDirections = directions[key].filter(dire => this.props.directions.includes(dire))

    compares.forEach((compare) => {
      validDirections.forEach(dire => {
        const { near, dist, value, origin, length } = this.calcPosValuesSingle(values, dire, target, compare, key)
        if (near) {
          checkArrayWithPush(results, dist, { i: compare.i, $: compare.$ , value, origin, length })
        }
      })
    })

    const resultArray = Object.entries(results)
    if (resultArray.length) {
      const [minDistance, activeCompares] = resultArray.sort(([dist1], [dist2]) => Math.abs(dist1) - Math.abs(dist2))[0]
      const dist = parseInt(minDistance)
      return {
        v: values[key] - dist,
        dist: dist,
        lines: activeCompares,
        indices: activeCompares.map(({ i }) => i),
      }
    }

    return {
      v: values[key],
      dist: 0,
      lines: [],
      indices: [],
    }
  }

  calcPosValuesSingle(values, dire, target, compare, key) {
    const { x, y } = values
    const W = target.w
    const H = target.h
    const { l, r, t, b, lr, tb } = compare
    const { origin, length } = this.calcLineValues({ x, y }, target, compare, key)

    const result = {
      // 距离是否达到吸附阈值
      near: false,
      // 距离差
      dist: Number.MAX_SAFE_INTEGER,
      // 辅助线坐标
      value: 0,
      // 辅助线长度
      length,
      // 辅助线起始坐标（对应绝对定位的top/left）
      origin,
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
    }

    return result
  }

  // 检查是否拖出容器
  checkDragOut({ x, y }, target) {
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

    return { limitX, limitY }
  }

  // 检查容器是否有定位属性
  checkContainerPosition() {
    const position = window.getComputedStyle(this.$, null).getPropertyValue('position')
    if (position === 'static') {
      console.error(
        'Warning: The `position` attribute of container is `static`! It may cause an error if you render in server-side.',
      )
      this.setState({ static: true })
    }
  }

  parseStyle() {
    return this.state.static
      ? { ...this.props.style, position: 'relative' }
      : this.props.style
  }

  _renderGuideLine() {
    const { vLines, hLines } = this.state
    const { lineStyle } = this.props
    const commonStyle = {
      position: 'absolute',
      backgroundColor: '#FF00CC',
      ...lineStyle,
    }

    // support react 15
    const Container = React.Fragment || 'div'

    return (
      <Container>
        {vLines.map(({ length, value, origin }, i) => (
          <span
            key={`v-${i}`}
            style={{ left: value, top: origin, height: length, width: 1, ...commonStyle }}
          />
        ))}
        {hLines.map(({ length, value, origin }, i) => (
          <span
            key={`h-${i}`}
            style={{ top: value, left: origin, width: length, height: 1, ...commonStyle }}
          />
        ))}
      </Container>
    )
  }

  render() {
    const { Container, activeClassName } = this.props
    const { indices } = this.state
    return (
      <Container style={this.parseStyle()} ref={ref => this.$ = ref}>
        {this.props.children.map((child, index) => React.cloneElement(child, {
          _init: this.initialize,
          _calc: this.calc(index),
          _stop: this.reset,
          active: indices.includes(index),
          activeClassName,
        }))}
        {this._renderGuideLine()}
      </Container>
    )
  }
}
