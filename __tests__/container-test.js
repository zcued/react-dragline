import { mount, render } from 'enzyme'
import { StateMock } from '@react-mock/state'
import { DraggableContainer, DraggableChild } from '../src/index'


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
