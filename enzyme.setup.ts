import * as Enzyme from 'enzyme'
import * as React16Adapter from 'enzyme-adapter-react-16'

// https://github.com/airbnb/enzyme/tree/master/packages
Enzyme.configure({ adapter: new React16Adapter() })
