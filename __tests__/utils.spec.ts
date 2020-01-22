import { unique, getMaxDistance, createCoreData } from '../src/utils'


test('unique', () => {
  const arr1 = [
    { id: 1, name: 'Beijing' },
    { id: 2, name: 'Shenzhen' },
    { id: 3, name: 'Guangzhou' },
    { id: 4, name: 'Shanghai' },
    { id: 4, name: 'Fuzhou' },
  ]

  const arr2 = [7, 9, 4, 0, 7, 12, 4]
  expect(unique(arr1, (a, b) => a.id === b.id).length).toBe(4)
  expect(unique(arr2).length).toBe(5)
})

test('getMaxDistance', () => {
  expect(getMaxDistance([2, 12, 44, 24, 9, 31])).toBe(42)
})

test('createCoreData', () => {
  const $ = null
  const cases = [
    {
      args1: { node: $, deltaX: 10, deltaY: 100 },
      args2: { originX: 44, originY: 44, x: 18, y: 28 },
      answer: { node: $, deltaX: 10, deltaY: 100, originX: 44, originY: 44, x: 18, y: 28 }
    },
    {
      args1: { node: $, deltaX: 8, deltaY: 88 },
      args2: { x: 46, y: 39 },
      answer: { node: $, deltaX: 8, deltaY: 88, originX: 46, originY: 39, x: 46, y: 39 }
    }
  ]

  expect(createCoreData(cases[0].args1, cases[0].args2)).toEqual(cases[0].answer)
  expect(createCoreData(cases[1].args1, cases[1].args2)).toEqual(cases[1].answer)
})