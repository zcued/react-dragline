import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Main from '../src/components/main'

describe('main page rendered succeed', () => {
  it('main page rendered', () => {
    const wrapper = shallow(<Main />)
    expect(wrapper.find('#main-page').length).to.equal(1)
  })
})
