import React from 'react'
import { DraggableCore } from 'react-draggable'
import PropTypes from 'prop-types'
import classNames from 'classnames'


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

  handleStart = (ev, b) => {
    this.lastX = b.lastX
    this.lastY = b.lastY
    this.props.onStart()
  }

  handleDrag = (ev, b) => {
    const dragX = b.lastX - this.lastX + this.props.position.x
    const dragY = b.lastY - this.lastY + this.props.position.y
    const {x, y} = this.props.onDrag(dragX, dragY)
    this.setState({ x, y })
  }

  handleStop = () => {
    const {x, y} = this.state
    this.props.handleChange({x, y})
    this.props.onStop()
  }

  render() {
    const { x, y } = this.state
    const {active, children, activeClassName} = this.props
    const style = {
      ...children.props.style,
      position: 'absolute',
      top: y,
      left: x,
    }

    const className = classNames(children.props.className, {
      [activeClassName]: active,
    })

    return (
      <DraggableCore
        grid={[1, 1]}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        onStart={this.handleStart}
        position={{ x, y }}
      >
        {React.cloneElement(this.props.children, { style, className })}
      </DraggableCore>
    )
  }
}
