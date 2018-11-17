export function unique(array) {
  const res = []
  for (let i = 0, len = array.length; i < len; i++) {
    const current = array[i]
    if (res.indexOf(current) === -1) {
      res.push(current)
    }
  }
  return res
}

export const checkArrayWithPush = (target, key, value) => {
  if (Array.isArray(target[key])) {
    target[key].push(value)
  } else {
    target[key] = [value]
  }
}

export default {
  unique,
  checkArrayWithPush,
}
