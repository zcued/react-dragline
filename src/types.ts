import { DraggableEvent } from 'react-draggable'


export type Grid = {
  x: number,
  y: number,
}

export type DragLineEvent = DraggableEvent

export type DragLineData = {
  node: HTMLElement,
  deltaY: number,
  deltaX: number,
  originX: number,
  originY: number,
  x: number,
  y: number,
}

export type DragLineEventHandler = (
  ev: DragLineEvent,
  data: DragLineData
) => void | false;