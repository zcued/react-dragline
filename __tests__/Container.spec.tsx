import * as React from "react"
import { mount } from "enzyme"
import { DraggableContainer, DraggableChild } from '../src/index'
import { DraggableElement } from '../src/DraggableContainer'
import { StateMock } from '@react-mock/state'


it('no children', () => {
  mount(<DraggableContainer />)
})

it('render lines', () => {
  const vLines = [
    { i: 1, length: 200, origin: 100, value: 300 },
  ]

  const hLines = [
    { i: 1, length: 300, origin: 100, value: 300 },
    { i: 2, length: 200, origin: 60, value: 100 },
  ]

  const wrapper = mount(
    <StateMock state={{ indices: [], vLines, hLines }}>
      <DraggableContainer lineStyle={{ backgroundColor: 'red' }} />
    </StateMock>
  )

  // exist
  expect(wrapper.find('.v-line').length).toEqual(1)
  expect(wrapper.find('.h-line').length).toEqual(2)

  // position
  expect(wrapper.find('.h-line').get(0).props.style.top).toEqual(300)
  expect(wrapper.find('.h-line').get(1).props.style.top).toEqual(100)

  // style
  expect(wrapper.find('.v-line').prop('style').backgroundColor).toEqual('red')
})


it('indices active', () => {
  const wrapper = mount(
    <StateMock state={{ indices: [1], vLines: [], hLines: [] }}>
      <DraggableContainer activeClassName="aligned">
        <DraggableChild key="a"><span className="child" /></DraggableChild>
        <DraggableChild key="b"><span className="child" /></DraggableChild>
      </DraggableContainer>
    </StateMock>
  )

  expect(wrapper.find('.child').at(0).hasClass('aligned')).toEqual(false)
  expect(wrapper.find('.child').at(1).hasClass('aligned')).toEqual(true)
})


it('reset', () => {
  const vLines = [
    { i: 1, length: 200, origin: 100, value: 300 },
  ]
  const wrapper = mount(<DraggableContainer />)

  wrapper.setState({ vLines })
  expect(wrapper.find('.v-line').length).toEqual(1)

  const instance = wrapper.instance() as DraggableContainer
  instance.reset()
  wrapper.update()
  expect(wrapper.find('.v-line').length).toEqual(0)
})


it('calc', () => {
  const children = [
    { id: 1, size: 100, position: { x: 100, y: 10 } },
    { id: 2, size: 100, position: { x: 400, y: 106 } },
    { id: 3, size: 150, position: { x: 100, y: 316 } },
    { id: 4, size: 200, position: { x: 480, y: 376 } },
  ]

  const wrapper = mount(
    <DraggableContainer limit={false} style={{ position: 'relative', width: 1440, height: 600 }}>
      {
        children.map(({ id, size, position }) => {
          return (
            <DraggableChild
              key={id}
              defaultPosition={position}
            >
              <div className="item" style={{ width: size, height: size }} />
            </DraggableChild>
          )
        })
      }
    </DraggableContainer>
  )

  const $children = [
    { i: 0, x: 100, y: 10, w: 100, h: 100, l: 100, r: 200, t: 10, b: 110, lr: 150, tb: 60 },
    { i: 1, x: 400, y: 106, w: 100, h: 100, l: 400, r: 500, t: 106, b: 206, lr: 450, tb: 156 },
    { i: 2, x: 100, y: 316, w: 150, h: 150, l: 100, r: 250, t: 316, b: 466, lr: 175, tb: 391 },
    { i: 3, x: 480, y: 376, w: 200, h: 200, l: 480, r: 680, t: 376, b: 576, lr: 580, tb: 476 },
  ] as Array<DraggableElement>

  const cases = [
    // 4 = 3 + 1
    { index: 1, input: { x: 485,y: 9 }, output: { x: 480, y: 10 } },
    // 2 = 1 + 1
    { index: 1,input: { x: 528,y: 313 }, output: { x: 530, y: 316 } },
    // 3
    { index: 1,input: { x: 360,y: 11 }, output: { x: 360, y: 10 } },
    // 1
    { index: 1,input: { x: 128,y: 176 }, output: { x: 125, y: 176 } },
  ]

  const component = wrapper.instance() as DraggableContainer

  // mock ondragstart
  component.$children = $children

  cases.forEach(({ index, input, output }) => {
    expect(component.calc(index)(input.x, input.y)).toEqual(output)
  })
})


it('drag limit', () => {
  const wrapper = mount(
    <DraggableContainer limit={true}>
      <DraggableChild
        key="1"
        defaultPosition={{ x: 100, y: 10 }}
      >
        <div className="item" style={{ width: 100, height: 100 }} />
      </DraggableChild>
    </DraggableContainer>
  )

  const $children = [{ i: 0, x: 100, y: 10, w: 100, h: 100, l: 100, r: 200, t: 10, b: 110, lr: 150, tb: 60 }] as Array<DraggableElement>
  const cases = [
    { input: { x: 943, y: 550 }, output: { x: 900, y: 500 } },
    { input: { x: -57, y: -28 }, output: { x: 0, y: 0 } },
  ]
  const component = wrapper.instance() as DraggableContainer

  component.$children = $children
  // @ts-ignore
  component.$ = { clientHeight: 600, clientWidth: 1000 }

  cases.forEach(({ input, output }) => {
    expect(component.calc(0)(input.x, input.y)).toEqual(output)
  })
})

it('initialize', () => {
  const children = [
    { id: 1, size: 100, position: { x: 100, y: 10 } },
    { id: 2, size: 200, position: { x: 480, y: 376 } },
  ]

  const wrapper = mount(
    <DraggableContainer limit={false} style={{ position: 'relative', width: 1440, height: 600 }}>
      {
        children.map(({ id, size, position }) => {
          return (
            <DraggableChild
              key={id}
              defaultPosition={position}
            >
              <div className="item" style={{ width: size, height: size }} />
            </DraggableChild>
          )
        })
      }
    </DraggableContainer>
  )

  const $1 = document.createElement('div')
  $1.classList.add('item')
  $1.setAttribute('data-x', '100')
  $1.setAttribute('data-y', '10')
  $1.setAttribute('style', 'width: 100px; height: 100px; position: absolute; top: 10px; left: 100px;')

  const $2 = document.createElement('div')
  $2.classList.add('item')
  $2.setAttribute('data-x', '480')
  $2.setAttribute('data-y', '376')
  $2.setAttribute('style', 'width: 200px; height: 200px; position: absolute; top: 376px; left: 480px;')

  const results = [
    { $: $1, b: 10, h: 0, i: 0, l: 100, lr: 100, r: 100, t: 10, tb: 10, w: 0, x: 100, y: 10 },
    { $: $2, b: 376, h: 0, i: 1, l: 480, lr: 480, r: 480,t: 376, tb: 376, w: 0, x: 480, y: 376 },
  ]

  const component = wrapper.instance() as DraggableContainer
  component.initialize()

  expect(component.$children).toEqual(results)
})


