import React from 'react';
import { shallow } from 'enzyme';
import TaskModule from './TaskModule';

describe('TaskModule Component', () => {
  const removeTaskModule = jest.fn();
  const wrapper = shallow(<TaskModule removeTaskModule={removeTaskModule} tasks={[]} />);

  it('Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('removeTaskModule called', () => {
    wrapper.find('#removeTaskModule').simulate('click');
    expect(removeTaskModule).toHaveBeenCalled();
  });
});
