// import React from 'react'
import * as React from 'react'
import { DraggableCore, DraggableEvent, DraggableData } from 'react-draggable'
import classNames from 'classnames'
import { createCoreData, noop } from './utils'


interface Props {
  children: React.ReactElement,
  defaultPosition: {
    x: number,
    y: number,
  },
  activeClassName?: string
  onStart?: Function
  onDrag?: Function
  onStop?: Function

  /* --- emitter --- */
  _start?: Function
  _drag?: Function
  _stop?: Function

  active?: boolean
}

interface State {
  x: number,
  y: number,
}

export class DraggableChild extends React.Component<Props, State> {

  static defaultProps = {
    defaultPosition: { x: 0, y: 0 },
    onStart: noop,
    onDrag: noop,
    onStop: noop,
  }

  lastX: number = 0
  lastY: number = 0

  constructor(props: Props) {
    super(props)
    this.state = {
      x: props.defaultPosition.x,
      y: props.defaultPosition.y,
    }
  }

  handleStart = (ev: DraggableEvent, b: DraggableData) => {
    const { x, y } = this.state
    this.lastX = b.lastX - x
    this.lastY = b.lastY - y
    /* --- emitter --- */
    this.props._start()
    this.props.onStart(ev, createCoreData(b, { x, y }))
  }

  handleDrag = (ev: DraggableEvent, b: DraggableData) => {
    const dragX = b.lastX - this.lastX
    const dragY = b.lastY - this.lastY
    /* --- emitter --- */
    const { x, y } = this.props._drag(dragX, dragY)
    this.setState({ x, y })

    this.props.onDrag(ev, createCoreData(b, {
      originX: dragX,
      originY: dragY,
      x,
      y,
    }))
  }

  handleStop = (ev: DraggableEvent, b: DraggableData) => {
    const { x, y } = this.state
    /* --- emitter --- */
    this.props._stop()
    this.props.onStop(ev, createCoreData(b, { x, y }))
  }

  render() {
    const { x, y } = this.state
    const { active, children, activeClassName } = this.props
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
