import { DragLineData } from './types'


export const noop = () => {}

export const execFuncSafely = (func: any, ...args: any[]) => {
  if (typeof func === 'function') func(...args)
}

export function unique<T>(array: Array<T>, compare = (a: T, b: T) => a === b) {
  const result = []
  for (let i = 0, len = array.length; i < len; i++) {
    const current = array[i]
    if (result.findIndex(v => compare(v, current)) === -1) {
      result.push(current)
    }
  }
  return result
}

export const getMaxDistance = (arr: number[]) => {
  const num = arr.sort((a, b) => a - b)
  return num[num.length - 1] - num[0]
}

export const createCoreData = (
  { node, deltaX, deltaY }: { node: HTMLElement, deltaX: number, deltaY: number },
  { originX, originY, x, y }: { originX?: number, originY?: number, x: number, y: number }
) => {
  const draglineData = {
    node,
    deltaY,
    deltaX,
    originX: originX || x,
    originY: originY || y,
    x,
    y,
  } as DragLineData

  return draglineData
}