import React from 'react';
import { mount } from 'enzyme';
import Filter from './Filter';

describe('Filter Component', () => {
  const sortBy = jest.fn();
  const wrapper = mount(<Filter sortBy={sortBy} />);

  it('Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('sortBy function', () => {
    wrapper.find('#filter').simulate('click');
    expect(sortBy).toHaveBeenCalled();
  });

});
