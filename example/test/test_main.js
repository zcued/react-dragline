import React from 'react'
import { expect } from 'chai'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Main from '../src/components/main'

Enzyme.configure({ adapter: new Adapter() })

describe('users page rendered succeed', () => {
  it('user list rendered', () => {
    const wrapper = mount(<Main />)
    expect(wrapper.find('#main-page').length).to.equal(1)
  })
})
