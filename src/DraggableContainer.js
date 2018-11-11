import React from 'react'
// import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// import { unique } from './utils'

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

// const alignTypes = Object.freeze({
//   t: 'top',
//   l: 'left',
//   b: 'bottom',
//   r: 'right',
//   v: 'ver',
//   h: 'hor',
// })

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
      vLine: [],
      hLine: [],
    }
  }

  // 拖拽初始时 计算出所有元素的坐标信息，存储于this.$children
  initCompareCoordinate = () => {
    this.$children = this.props.children.map(({props}, i) => {
      const $ = this.$.childNodes[i]

      return {
        $,
        x: props.position.x,
        y: props.position.y,
        width: $.clientWidth,
        height: $.clientHeight,
        left: props.position.x,
        right: props.position.x + $.clientWidth,
        top: props.position.y,
        bottom: props.position.y + $.clientHeight,
      }
    })
  }

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
    let minDistance = 99999
    let vLineValue = 0

    compares.forEach(({left, right}) => {
      if (Math.abs(x - left) < Math.abs(minDistance)) {
        minDistance = x - left
        vLineValue = left
      }

      if (Math.abs(x + width - right) < Math.abs(minDistance)) {
        minDistance = x - right + width
        vLineValue = right
      }
    })

    if (Math.abs(minDistance) < 5) {
      this.setState({vLine: [vLineValue]})
      return x - minDistance
    } else {
      this.setState({vLine: []})
      return x
    }
  }

  checkIsNearByY(y, compares, {height}) {
    let minDistance = 99999
    let hLineValue = 0

    compares.forEach(({top, bottom}) => {
      if (Math.abs(y - top) < Math.abs(minDistance)) {
        minDistance = y - top
        hLineValue = top
      }

      if (Math.abs(y + height - bottom) < Math.abs(minDistance)) {
        minDistance = y - bottom + height
        hLineValue = bottom
      }
    })

    if (Math.abs(minDistance) < 5) {
      this.setState({hLine: [hLineValue]})
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
