import React from 'react'
import { DraggableCore } from 'react-draggable'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { canDragX, canDragY, createCoreData, noop } from './utils'

export default class DraggableChild extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    defaultPosition: PropTypes.object,
    onStart: PropTypes.func,
    onDrag: PropTypes.func,
    onStop: PropTypes.func,
    axis: PropTypes.oneOf(['both', 'x', 'y']),
    grid: PropTypes.array,
  }

  static defaultProps = {
    axis: 'both',
    defaultPosition: { x: 0, y: 0 },
    onStart: noop,
    onDrag: noop,
    onStop: noop,
    grid: [1,1],
  }

  constructor(props) {
    super(props)
    this.state = {
      x: props.defaultPosition.x,
      y: props.defaultPosition.y,
    }

    this.x = props.defaultPosition.x
    this.y = props.defaultPosition.y
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.compareCoordinates(this.props.defaultPosition, nextProps.defaultPosition) ||
      this.compareCoordinates(this.state, nextState) ||
        this.props.active !== nextProps.active
    )
  }

  compareCoordinates = (firstCoords, secondCoords) => {
    return (firstCoords.x !== secondCoords.x || firstCoords.y !== secondCoords.y)
  }

  handleStart = (ev, b) => {
    const { x, y } = this.state
    this.lastX = canDragX(this.props.axis) ? b.lastX - x : x
    this.lastY = canDragY(this.props.axis) ? b.lastY - y : y
    this.props._start()
    this.props.onStart(ev, createCoreData(b, { x, y }))
  }

  handleDrag = (ev, b) => {
    const dragX = canDragX(this.props.axis) ? b.lastX - this.lastX : this.lastX
    const dragY = canDragY(this.props.axis) ? b.lastY - this.lastY : this.lastY
    const { x, y } = this.props._drag(dragX, dragY)
    this.setState({ x, y })

    this.props.onDrag(ev, createCoreData(b, {
      originX: dragX,
      originY: dragY,
      x,
      y,
    }))
  }

  handleStop = (ev, b) => {
    const { x, y } = this.state
    this.props._stop()
    this.props.onStop(ev, createCoreData(b, { x, y }))
  }

  render() {
    const { x, y } = this.state
    const { active, children, activeClassName, grid } = this.props
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
        grid={grid}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        onStart={this.handleStart}
        position={{ x, y }}
      >
        {React.cloneElement(this.props.children, {
          style,
          className,
          ['data-x']: x,
          ['data-y']: y,
        })}
      </DraggableCore>
    )
  }
}
