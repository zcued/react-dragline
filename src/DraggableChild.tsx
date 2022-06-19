import * as React from 'react'
import { DraggableCore, DraggableEventHandler } from 'react-draggable'
import classNames from 'classnames'
import { createCoreData, execFuncSafely, noop } from './utils'
import { DragLineEventHandler, Grid } from './types'

interface Props {
  children: React.ReactElement,
  defaultPosition: Grid,
  activeClassName?: string,
  onStart?: DragLineEventHandler,
  onDrag?: DragLineEventHandler,
  onStop?: DragLineEventHandler,
}

interface PropsFromParent {
  _start: () => void,
  _drag: (dragX: number, dragY: number) => Grid,
  _stop: () => void,
  active: boolean,
}

interface State extends Grid {}

export class DraggableChild extends React.Component<Props, State> {

  static defaultProps = {
    defaultPosition: { x: 0, y: 0 },
    onStart: noop,
    onDrag: noop,
    onStop: noop,
  }

  lastX = 0
  lastY = 0

  constructor(props: Props) {
    super(props)
    this.state = {
      x: props.defaultPosition.x,
      y: props.defaultPosition.y,
    }
  }

  handleStart: DraggableEventHandler = (ev, b) => {
    const { _start, onStart } = this.props as (Props & PropsFromParent)
    const { x, y } = this.state

    this.lastX = b.lastX - x
    this.lastY = b.lastY - y
    _start()
    execFuncSafely(onStart, ev, createCoreData(b, { x, y }))
  }

  handleDrag: DraggableEventHandler = (ev, b) => {
    const { _drag, onDrag } = this.props as (Props & PropsFromParent)
    const dragX = b.lastX - this.lastX
    const dragY = b.lastY - this.lastY
    const { x, y } = _drag(dragX, dragY)

    this.setState({ x, y })

    execFuncSafely(onDrag, ev, createCoreData(b, {
      originX: dragX,
      originY: dragY,
      x,
      y,
    }))
  }

  handleStop: DraggableEventHandler = (ev, b) => {
    const { x, y } = this.state
    const { _stop, onStop } = this.props as (Props & PropsFromParent)

    _stop()
    execFuncSafely(onStop, ev, createCoreData(b, { x, y }))
  }

  render() {
    const { x, y } = this.state
    const { active, children, activeClassName } = this.props as (Props & PropsFromParent)
    const style = {
      ...children.props.style,
      position: 'absolute',
      top: y,
      left: x,
    }

    const className = classNames(
      children.props.className, 
      activeClassName ? { [activeClassName]: active } : null
    )

    return (
      <DraggableCore
        grid={[1, 1]}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        onStart={this.handleStart}
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
