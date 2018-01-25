import React from 'react';
import { mount } from 'enzyme';
import AddTaskModule from './AddTaskModule';

describe('AddTaskModule Component', () => {
  const addTaskModule = jest.fn();
  const wrapper = mount(<AddTaskModule addTaskModule={addTaskModule} />);

  it('Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('addTaskModule called', () => {
    wrapper.find('#addTaskModule').simulate('click');
    expect(addTaskModule).toHaveBeenCalled();
  });
});
