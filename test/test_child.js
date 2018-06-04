import React from 'react'
import { expect } from 'chai'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Child from '../src/child'

Enzyme.configure({ adapter: new Adapter() })

describe('child rendered succeed', () => {
  it('child rendered', () => {
    const wrapper = mount(<Child />)
    expect(wrapper.find('#child').length).to.equal(1)
  })
})
