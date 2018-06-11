import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { unique } from './utils'

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

export default class DraggableContainer extends React.Component {
  static propTypes = {
    Tag: PropTypes.string,
  }

  static defaultProps = {
    Tag: 'div',
  }

  constructor(props) {
    super(props)
    this.state = {
      vLine: [],
      hLine: [],
    }

    this.dragChildIndex = -1
    this.$target = {}
    this.$children = []
  }

  componentDidMount() {

  }

  componentWillUpdate() {
    this.$children = []
  }

  componentDidUpdate() {

  }

  // top bottom ver => 渲染水平线
  // left right hor => 渲染竖直线
  static getGuideLineDirection(key) {
    return ['top', 'bottom', 'ver'].includes(key) ? 'h' : 'v'
  }

  // top bottom ver => 真实坐标为top
  // left right hor => 展示坐标为left
  static getGuideLineActualDirection(key) {
    return ['top', 'bottom', 'ver'].includes(key) ? 'top' : 'left'
  }

  getContainerPosition = (ref) => {
    const rect = ref.getBoundingClientRect()
    const { top, left } = rect
    this.$target = {
      $ref: ref,
      top,
      left,
    }
  }

  getChildPosition = (index) => ref => {
    if (!ref) return
    const rect = ref.getBoundingClientRect()
    const {
      top, bottom, left, right,
    } = rect
    this.$children[index] = {
      $ref: ref,
      top,
      bottom,
      left,
      right,
      ver: Math.round(((bottom - top) / 2) + top),
      hor: Math.round(((right - left) / 2) + left),
    }
  }

  checkRenderGuideLine() {
    const targetIndex = this.dragChildIndex
    const {
      top, bottom, left, right,
    } = this.$children[targetIndex].$ref.getBoundingClientRect()
    const targetRect = {
      top,
      bottom,
      left,
      right,
      ver: Math.round(((bottom - top) / 2) + top),
      hor: Math.round(((right - left) / 2) + left),
    }

    const lines = {
      v: [],
      h: [],
    }

    this.$children.forEach((rect, index) => {
      if (index !== targetIndex) {
        Object.keys(targetRect).forEach(key => {
          if (rect[key] === targetRect[key]) {
            const direKey = DraggableContainer.getGuideLineDirection(key)
            const posKey = DraggableContainer.getGuideLineActualDirection(key)
            console.log(`${targetRect[key]} - ${this.$target[posKey]} = ${targetRect[key] - this.$target[posKey]}`)
            lines[direKey].push(targetRect[key] - this.$target[posKey])
          }
        })
      }
    })

    const vLine = unique(lines.v)
    const hLine = unique(lines.h)

    this.setState({ vLine, hLine })
  }

  handleDragStart(index) {
    return () => {
      this.dragChildIndex = index
    }
  }

  handleDragging = () => {
    this.checkRenderGuideLine()
  }

  handleDragStop = () => {
    this.dragChildIndex = -1
    this.setState({ vLine: [], hLine: [] })
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
    const { Tag } = this.props

    return (
      <Tag style={{ position: 'relative' }} ref={this.getContainerPosition}>
        {this.props.children.map((child, index) => React.cloneElement(child, {
            passChildPosition: this.getChildPosition(index),
            handleDragStart: this.handleDragStart(index),
            handleDragging: this.handleDragging,
            handleDragStop: this.handleDragStop,
          }))}
        {this._renderGuideLine()}
      </Tag>
    )
  }
}
