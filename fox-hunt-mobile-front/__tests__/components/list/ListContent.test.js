import React from 'react';
import { shallow, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import ListContent from '../../../src/components/list/ListContent';

configure({ adapter: new Adapter() });
describe('Testing ListContent component', () => {
  it('renders as expected', () => {
    const wrapper = shallow(<ListContent title={'Name'} value={'Maria'} />);
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({ title: 'Name' });
    expect(wrapper).toMatchSnapshot();
  });
});
