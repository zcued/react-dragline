import React from 'react'
// import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { unique, checkArrayWithPush } from './utils'


const VLine = styled.span`
  position: absolute;
  top: 0;
  width: 1px;
  height: 100%;
  background: #00FFFF;
`

const HLine = styled.span`
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  background: #00FFFF;
`

export default class DraggableContainer extends React.PureComponent {
  static propTypes = {
    tag: PropTypes.string,
    style: PropTypes.object,
    directions: PropTypes.array,
    threshold: PropTypes.number,
  }

  static defaultProps = {
    tag: 'div',
    style: {},
    directions: ['tt', 'bb', 'll', 'rr', 'tb', 'lr' ],
    threshold: 5,
  }

  constructor(props) {
    super(props)

    this.state = {
      activeIndex: [],
      vLine: [],
      hLine: [],
    }
  }

  // 拖拽初始时 计算出所有元素的坐标信息，存储于this.$children
  initCompareCoordinate = () => {
    this.$children = this.props.children.map(({props}, i) => {
      const $ = this.$.childNodes[i]
      const {x, y} = props.position
      const w = $.clientWidth
      const h = $.clientHeight

      return {
        $,
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

      return {
        x: this.compareNear(x, compares, target, ['ll', 'rr', 'lr'], 'vLine'),
        y: this.compareNear(y, compares, target, ['tt', 'bb', 'tb'], 'hLine'),
      }
    }
  }

  clear = () => {
    this.setState({vLine: [], hLine: []})
  }

  compareNearSingle(v, dire, {l, r, t, b, lr, tb}, {w, h}) {
    const result = {
      near: false,
      dist: Number.MAX_SAFE_INTEGER,
      line: 0,
    }

    if (!this.props.directions.includes(dire)) {
      return result
    }

    switch (dire) {
      case 'lr':
        result.dist = v + w / 2 - lr
        result.line = lr
        break
      case 'll':
        result.dist = v - l
        result.line = l
        break
      case 'rr':
        result.dist = v + w - r
        result.line = r
        break
      case 'tt':
        result.dist = v - t
        result.line = t
        break
      case 'bb':
        result.dist = v + h - b
        result.line = b
        break
      case 'tb':
        result.dist = v + h / 2 - tb
        result.line = tb
        break
    }

    if (Math.abs(result.dist) < this.props.threshold + 1) {
      result.near = true
      return result
    }

    return result
  }

  compareNear(value, compares, target, direKeys, lineState) {
    /**
     * results: {
     *   3: [345, 500]
     * }
     * key: 距离需要对齐的坐标3px
     * value: 需要显示辅助线数组（可能存在对条，例：大小完全相同的元素左中右同时对齐）
     * TODO: option => 多边对齐是否显示多条
     */
    const results = {}

    compares.forEach((compare) => {
      direKeys.forEach(dire => {
        const {near, dist, line} = this.compareNearSingle(value, dire, compare, target)
        if (near) {
          checkArrayWithPush(results, dist, line)
        }
      })
    })

    const resultArray = Object.entries(results)
    if (resultArray.length) {
      const [minDistance, lines] = resultArray.sort(([key1], [key2]) => Math.abs(key1) - Math.abs(key2))[0]
      this.setState({[lineState]: unique(lines)})
      return value - minDistance
    } else {
      this.setState({[lineState]: []})
      return value
    }
  }

  _renderGuideLine() {
    const { vLine, hLine } = this.state

    return (
      <React.Fragment>
        {vLine.map(v => <VLine key={`v-${v}`} style={{ left: v }} />)}
        {hLine.map(h => <HLine key={`h-${h}`} style={{ top: h }} />)}
      </React.Fragment>
    )
  }

  render() {
    const Tag = this.props.tag

    return (
      <Tag style={{ position: 'relative', ...this.props.style }} ref={ref => this.$ = ref}>
        {this.props.children.map((child, index) => React.cloneElement(child, {
          initCompareCoordinate: () => this.initCompareCoordinate(index),
          'z-key': index + 1,
          calc: this.calc(index),
          clear: this.clear,
        }))}
        {this._renderGuideLine()}
      </Tag>
    )
  }
}
