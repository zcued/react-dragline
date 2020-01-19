import * as React from 'react'
import { DraggableCore, DraggableEvent, DraggableData } from 'react-draggable'
import classNames from 'classnames'
import { createCoreData, noop, DragLineData } from './utils'


type DragLineEvent = DraggableEvent

interface Props {
  children: React.ReactElement,
  defaultPosition: {
    x: number,
    y: number,
  },
  activeClassName?: string,
  onStart?: (ev: DragLineEvent, b: DragLineData) => void,
  onDrag?: (ev: DragLineEvent, b: DragLineData) => void,
  onStop?: (ev: DragLineEvent, b: DragLineData) => void,
}

interface PropsFromParent {
  _start: Function,
  _drag: Function,
  _stop: Function,
  active: boolean,
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

  lastX = 0
  lastY = 0

  constructor(props: Props) {
    super(props)
    this.state = {
      x: props.defaultPosition.x,
      y: props.defaultPosition.y,
    }
  }

  handleStart = (ev: DraggableEvent, b: DraggableData) => {
    const { _start, onStart } = this.props as (Props & PropsFromParent)
    const { x, y } = this.state

    this.lastX = b.lastX - x
    this.lastY = b.lastY - y
    _start()
    onStart(ev, createCoreData(b, { x, y }))
  }

  handleDrag = (ev: DraggableEvent, b: DraggableData) => {
    const { _drag, onDrag } = this.props as (Props & PropsFromParent)
    const dragX = b.lastX - this.lastX
    const dragY = b.lastY - this.lastY
    const { x, y } = _drag(dragX, dragY)

    this.setState({ x, y })
    onDrag(ev, createCoreData(b, {
      originX: dragX,
      originY: dragY,
      x,
      y,
    }))
  }

  handleStop = (ev: DraggableEvent, b: DraggableData) => {
    const { x, y } = this.state
    const { _stop, onStop } = this.props as (Props & PropsFromParent)

    _stop()
    onStop(ev, createCoreData(b, { x, y }))
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
