import React from 'react';
import { shallow } from 'enzyme';
import Task from './Task';

describe('Task Component', () => {
  const removeTask = jest.fn();
  const toggleTask = jest.fn();
  const wrapper = shallow(<Task removeTask={removeTask} toggleTask={toggleTask} />);

  it('Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('removeTask called', () => {
    wrapper.find('#removeTask').simulate('click');
    expect(removeTask).toHaveBeenCalled();
  });

  it('toggleTask called', () => {
    wrapper.find('#toggleTask').simulate('click');
    expect(toggleTask).toHaveBeenCalled();
  });

});
