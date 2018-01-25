import React from 'react';
import { mount } from 'enzyme';
import AddTask from './AddTask';

describe('AddTask Component', () => {
  const addNewTask = jest.fn();
  const wrapper = mount(<AddTask addNewTask={addNewTask} moduleId={1} />);

  it('Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('addNewTask called', () => {
    wrapper.find('#addNewTask').simulate('click');
    expect(addNewTask).toHaveBeenCalled();
  });

});
