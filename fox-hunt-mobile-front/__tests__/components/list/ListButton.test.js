import React from 'react';
import ListButton from '../../../src/components/list/ListButton';
import { shallow, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
describe('Testing ListButton component', () => {
  it('renders correctly ', () => {
    const wrapper = shallow(<ListButton />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
