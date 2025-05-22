import React from 'react';
import { shallow, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import ListContentWithButton
  from '../../../src/components/list/ListContentWithButton';

configure({ adapter: new Adapter() });
describe('Testing ListContentWithButton component', () => {
  it('renders as expected', () => {
    const wrapper = shallow(<ListContentWithButton title={'Surname'} value={'Sidorova'} />);
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({});
    expect(wrapper).toMatchSnapshot();
  });
});
