export const noop = () => {}

export function unique(array, compare = (a, b) => a === b) {
  const result = []
  for (let i = 0, len = array.length; i < len; i++) {
    const current = array[i]
    if (result.findIndex(v => compare(v, current)) === -1) {
      result.push(current)
    }
  }
  return result
}

export const checkArrayWithPush = (target, key, value) => {
  if (Array.isArray(target[key])) {
    target[key].push(value)
  } else {
    target[key] = [value]
  }
}

export const createCoreData = ({ node, deltaX, deltaY }, { originX, originY, x, y }) => {
  return {
    node,
    deltaY,
    deltaX,
    originX: originX || x,
    originY: originY || y,
    x,
    y,
  }
}

export const getMaxDistance = (arr) => {
  const num = arr.sort((a, b) => a - b)
  return num[num.length - 1] - num[0]
}

export default {
  noop,
  unique,
  createCoreData,
  checkArrayWithPush,
}
