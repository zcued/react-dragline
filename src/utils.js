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

export default {}
