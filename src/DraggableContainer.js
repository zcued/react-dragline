import React from 'react'
import PropTypes from 'prop-types'
import { checkArrayWithPush, checkOverlapRectangles, getMaxDistance, unique } from './utils'
import isEqual from 'lodash.isequal'

export default class DraggableContainer extends React.Component {
  // container HTMLElement
  $ = null
  // children HTMLElement
  $children = []
  lastXpostion = null
  lastYpostion = null

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
    detectOverlap: PropTypes.bool,
  }

  static defaultProps = {
    Container: 'div',
    style: {},
    directions: ['tt', 'bb', 'll', 'rr', 'tb', 'lr', 'rl', 'mv', 'mh'],
    threshold: 5,
    className: '',
    activeClassName: 'active',
    limit: true,
    lineStyle: {},
    detectOverlap: false,
  }

  constructor(props) {
    super(props)

    this.state = {
      indices: [],
      vLines: [],
      hLines: [],
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState) || !isEqual(this.props, nextProps)
  }

  // 拖拽初始时 计算出所有元素的坐标信息，存储于this.$children
  // The coordinate information of all elements is calculated at the beginning of dragging and stored in this.$children
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

  reset = () => {
    this.setState({ vLines: [], hLines: [], indices: [] })
  }

  // 拖动中计算是否吸附/显示辅助线
  // Calculate whether to adsorb/display auxiliary lines while dragging
  calc = (index) => {
    return (x, y) => {
      const target = this.$children[index]
      const compares = this.$children.filter((_, i) => i !== index)

      if (this.props.limit) {
        const { limitX, limitY } = this.checkDragOut({ x, y }, target)
        x = limitX
        y = limitY
      }

      if (this.props.detectOverlap) {
        if (this.checkOverlap({ x, y }, target)) {
          if (this.lastXpostion === null) {
            this.lastXpostion = x
            this.lastYpostion = y
          }
          return { x: this.lastXpostion, y: this.lastYpostion }
        }
      }
      this.lastXpostion = null
      this.lastYpostion = null

      if (compares.length === 0) {
        return { x, y }
      }

      return this.calcAndDrawLines({ x, y }, target, compares)
    }
  }

  checkOverlap({ x, y }, target) {
    for (let i = 0; i < this.$children.length; i += 1) {
      if (i === target.i) continue

      if (checkOverlapRectangles({ ...target, ...{ x, y } }, this.$children[i]))
        return true
    }
    return false
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

    // https://github.com/zcued/react-dragline/issues/9
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
      x: ['ll', 'rr', 'lr', 'rl', 'mh'],
      y: ['tt', 'bb', 'tb', 'mv'],
    }

    // filter unnecessary directions
    const validDirections = directions[key].filter(dire => this.props.directions.includes(dire))

    compares.forEach((compare) => {
      validDirections.forEach(dire => {
        const { near, dist, value, origin, length } = this.calcPosValuesSingle(values, dire, target, compare, key)
        if (near) {
          checkArrayWithPush(results, dist, { i: compare.i, $: compare.$, value, origin, length })
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
    const { l, r, t, b, lr, tb, x: xCompare } = compare
    const { origin, length } = this.calcLineValues({ x, y }, target, compare, key)

    const result = {
      // 距离是否达到吸附阈值
      // Whether the distance reaches the adsorption threshold
      near: false,
      // 距离差
      // Distance difference
      dist: Number.MAX_SAFE_INTEGER,
      // 辅助线坐标
      // Auxiliary line coordinates
      value: 0,
      // 辅助线长度
      length,
      // 辅助线起始坐标（对应绝对定位的top/left）
      // Starting coordinates of auxiliary line (corresponding to top/left of absolute positioning)
      origin,
    }

    switch (dire) {
      case 'lr': {
        const sides = []
        sides.push({ dist: x - r, value: r }) // right side
        sides.push({ dist: x + W - xCompare, value: l }) // left side
        sides.forEach(side => {
          if (Math.abs(side.dist) < Math.abs(result.dist)) {
            result.dist = side.dist
            result.value = side.value
          }
        })
        break
      }
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
      case 'tb': {
        const sides = []
        sides.push({ dist: y + H - t, value: t }) // top side
        sides.push({ dist: y - b, value: b }) // bottom side
        sides.forEach(side => {
          if (Math.abs(side.dist) < Math.abs(result.dist)) {
            result.dist = side.dist
            result.value = side.value
          }
        })
        break
      }
      case 'mv': // middle vertical
        result.dist = y + H / 2 - tb
        result.value = tb
        break
      case 'mh': // middle horizontal
        result.dist = x + W / 2 - lr
        result.value = lr
        break
    }

    if (Math.abs(result.dist) < this.props.threshold + 1) {
      result.near = true
    }

    return result
  }

  // 检查是否拖出容器
  // Check if you drag out the container
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
            className="v-line"
            key={`v-${i}`}
            style={{ left: value, top: origin, height: length, width: 1, ...commonStyle }}
          />
        ))}
        {hLines.map(({ length, value, origin }, i) => (
          <span
            className="h-line"
            key={`h-${i}`}
            style={{ top: value, left: origin, width: length, height: 1, ...commonStyle }}
          />
        ))}
      </Container>
    )
  }

  _renderChildren() {
    const { activeClassName, children } = this.props
    const { indices } = this.state

    if (Array.isArray(children)) {
      return (
        <React.Fragment>
          {
            children.map((child, index) => React.cloneElement(child, {
              _start: this.initialize,
              _drag: this.calc(index),
              _stop: this.reset,
              active: indices.includes(index),
              activeClassName,
            }))
          }
        </React.Fragment>
      )
    }

    return children
  }

  render() {
    const { Container, style } = this.props

    return (
      <Container style={style} ref={ref => this.$ = ref}>
        {this._renderChildren()}
        {this._renderGuideLine()}
      </Container>
    )
  }
}
