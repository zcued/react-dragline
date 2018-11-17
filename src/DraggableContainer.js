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
  }

  static defaultProps = {
    tag: 'div',
    style: {},
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
        x: x,
        y: y,
        width: w,
        height: h,
        left: x,
        right: x + w,
        top: y,
        bottom: y + h,

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
        x: this.checkIsNearByX(x, compares, target),
        y: this.checkIsNearByY(y, compares, target),
      }
    }
  }

  clear = () => {
    this.setState({vLine: [], hLine: []})
  }

  checkIsNearByX(x, compares, {width}) {
    // 触发吸附的阈值，TODO加入option中
    const threshold = 5
    /**
     * results: {
     *   3: [345, 500]
     * }
     * key: 距离需要对齐的坐标3px
     * value: 需要显示辅助线数组（可能存在对条，例：大小完全相同的元素左中右同时对齐）
     * TODO: option => 多边对齐是否显示多条
     */
    const results = {}

    // 比较其他元素与当前拖动的元素
    compares.forEach(({left, right, lr}) => {
      if (Math.abs(x + width / 2 - lr) < threshold) {
        const minDistance = x + width / 2 - lr
        const vLineValue = lr
        checkArrayWithPush(results, minDistance, vLineValue)
      }

      if (Math.abs(x - left) < threshold) {
        const minDistance = x - left
        const vLineValue = left
        checkArrayWithPush(results, minDistance, vLineValue)
      }

      if (Math.abs(x + width - right) < threshold) {
        const minDistance = x + width - right
        const vLineValue = right
        checkArrayWithPush(results, minDistance, vLineValue)
      }
    })

    const resultArray = Object.entries(results)
    if (resultArray.length) {
      const [minDistance, vLine] = resultArray.sort(([key1], [key2]) => Math.abs(key1) - Math.abs(key2))[0]
      this.setState({vLine: unique(vLine)})
      return x - minDistance
    } else {
      this.setState({vLine: []})
      return x
    }
  }

  checkIsNearByY(y, compares, {height}) {
    const threshold = 5
    const results = {}

    compares.forEach(({top, bottom, tb}) => {
      if (Math.abs(y + height / 2 - tb) < threshold) {
        const minDistance = y + height / 2 - tb
        const vLineValue = tb
        checkArrayWithPush(results, minDistance, vLineValue)
      }

      if (Math.abs(y - top) < threshold) {
        const minDistance = y - top
        const hLineValue = top
        checkArrayWithPush(results, minDistance, hLineValue)
      }

      if (Math.abs(y + height - bottom) < threshold) {
        const minDistance = y - bottom + height
        const hLineValue = bottom
        checkArrayWithPush(results, minDistance, hLineValue)
      }
    })

    const resultArray = Object.entries(results)
    if (resultArray.length) {
      const [minDistance, hLine] = resultArray.sort(([key1], [key2]) => Math.abs(key1) - Math.abs(key2))[0]
      this.setState({hLine: unique(hLine)})
      return y - minDistance
    } else {
      this.setState({hLine: []})
      return y
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
