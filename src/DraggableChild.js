import React from 'react'
import Draggable from 'react-draggable'
import PropTypes from 'prop-types'


const noop = () => {}

export default class DraggableChild extends React.Component {
  static propTypes = {
    handleDragStart: PropTypes.func,
    handleDragStop: PropTypes.func,
    handleDragging: PropTypes.func,
    passChildPosition: PropTypes.func,
  }

  // eslint 无法检测到 React.cloneElement 传入的Props
  static defaultProps = {
    handleDragStart: noop,
    handleDragging: noop,
    handleDragStop: noop,
    passChildPosition: noop,
  }

  constructor(props) {
    super(props)
    this.dragging = false
  }

  handleStart = () => {
    // console.log('handleStart')
  }

  handleDrag = () => {
    if (!this.dragging) {
      this.dragging = true
      this.props.handleDragStart()
    }

    this.props.handleDragging()
  }

  handleStop = () => {
    this.dragging = false
    this.props.handleDragStop()
  }


  render() {
    const child = React.cloneElement(this.props.children, {
      ref: this.props.passChildPosition,
    })
    return (
      <Draggable
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
      >
        {child}
      </Draggable>
    )
  }
}
