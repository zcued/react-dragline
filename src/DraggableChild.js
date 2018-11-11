import React from 'react'
// import ReactDom from 'react-dom'
import { DraggableCore } from 'react-draggable'
import PropTypes from 'prop-types'

// const noop = () => {}

export default class DraggableChild extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    position: PropTypes.object,
  }

  static defaultProps = {
    position: {x: 0, y: 0},
  }

  constructor(props) {
    super(props)
    this.state = {
      x: props.position.x,
      y: props.position.y,
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleStart = (ev, b) => {
    this.lastX = b.lastX
    this.lastY = b.lastY
    this.props.initCompareCoordinate()
  }

  handleDrag = (ev, b) => {
    const dragX = b.lastX - this.lastX + this.props.position.x
    const dragY = b.lastY - this.lastY + this.props.position.y
    const {x, y} = this.props.calc(dragX, dragY)
    this.setState({ x, y })
  }

  handleStop = () => {
    const {x, y} = this.state
    this.props.handleChange({x, y})
    this.props.clear()
  }

  render() {
    const { x, y } = this.state
    const children = this.props.children
    const style = {
      ...children.props.style,
      position: 'absolute',
      top: y,
      left: x,
    }

    return (
      <DraggableCore
        grid={[1, 1]}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        onStart={this.handleStart}
        position={{ x, y }}
      >
        {React.cloneElement(this.props.children, { style, 'data-z-key': this.props['z-key'] })}
      </DraggableCore>
    )
  }
}
