import React from 'react'
// import ReactDom from 'react-dom'
import { DraggableCore } from 'react-draggable'
import PropTypes from 'prop-types'

// const noop = () => {}

export default class DraggableChild extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  }

  static defaultProps = {

  }

  state = {
    x: 0,
    y: 0,
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleStart = () => {
    this.props.initCompareCoordinate()
  }

  handleDrag = (ev, b) => {
    const dragX = b.deltaX + this.state.x
    const dragY = b.deltaY + this.state.y
    const {x, y} = this.props.calc(dragX, dragY)
    this.setState({ x, y })
  }

  handleStop = () => {
    this.props.clear()
  }

  render() {
    const { x, y } = this.state
    const child = this.props.children
    const style = { ...child.props.style, transform: `translate(${x}px, ${y}px)` }

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
