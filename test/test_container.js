import React from 'react'
import { expect } from 'chai'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Container from '../src/container'

Enzyme.configure({ adapter: new Adapter() })

describe('container rendered succeed', () => {
  it('container rendered', () => {
    const wrapper = mount(<Container />)
    expect(wrapper.find('#container').length).to.equal(1)
  })
})
