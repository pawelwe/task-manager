import React from 'react';
import { shallow } from 'enzyme';
import TaskModule from './TaskModule';

describe('TaskModule Component', () => {
  const toggleModal = jest.fn();
  const wrapper = shallow(<TaskModule toggleModal={toggleModal} tasks={[]} />);

  it('Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('toggleModal called', () => {
    wrapper.find('#removeTaskModule').simulate('click');
    expect(toggleModal).toHaveBeenCalled();
  });
});
