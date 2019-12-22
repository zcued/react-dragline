// 去重
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