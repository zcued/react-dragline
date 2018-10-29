import React from 'react'
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
  }

  static defaultProps = {
    tag: 'div',
  }

  constructor(props) {
    super(props)

    this.state = {
      activeIndex: [],
      vLine: [],
      hLine: [],
    }
  }


  componentDidMount() {

  }

  initCompareCoordinate = (index) => {
    const $children = Array.from(this.$.childNodes)
    const { top, left } = this.$.getBoundingClientRect()
    this.compareCoordinate = {
      top: [],
      left: [],
      right: [],
      bottom: [],
      horCenter: [],
      verCenter: [],
    }

    this.extraX = left
    this.extraY = top

    $children
      .filter(($, i) => i !== index)
      .forEach(($) => {
        const {top, left, right, bottom, width, height} = $.getBoundingClientRect()
        this.checkExistAndPush(this.compareCoordinate.top, top)
        this.checkExistAndPush(this.compareCoordinate.left, left)
        this.checkExistAndPush(this.compareCoordinate.bottom, bottom)
        this.checkExistAndPush(this.compareCoordinate.right, right)
        this.checkExistAndPush(this.compareCoordinate.horCenter, left + (width / 2))
        this.checkExistAndPush(this.compareCoordinate.verCenter, top + (height / 2))
      })
  }

  calc = (key) => {
    return (x, y) => {
      const $target = this.$.childNodes[key]
      const {top, left, right, bottom, width, height} = $target.getBoundingClientRect()
      const targetCoordinate = {
        top,
        left,
        right,
        bottom,
        horCenter: left + (width / 2),
        verCenter: top + (height / 2),
      }

      const vLine = []
      const hLine = []

      Object.keys(targetCoordinate).forEach(key => {
        const vKeys = ['left', 'right', 'horCenter']

        if (this.compareCoordinate[key].includes(targetCoordinate[key])) {
          if (vKeys.includes(key)) {
            vLine.push(targetCoordinate[key] - this.extraX)
          } else {
            hLine.push(targetCoordinate[key] - this.extraY)
          }
        }
      })

      this.setState({vLine, hLine})

      return {x, y}
    }
  }

  clear = () => {
    this.setState({vLine: [], hLine: []})
  }

  checkExistAndPush(arr, v) {
    if (arr.includes(v) === false) {
      arr.push(v)
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
      <Tag style={{ position: 'relative' }} ref={ref => this.$ = ref}>
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
