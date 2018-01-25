import React from 'react';
import { shallow } from 'enzyme';
import TaskItemList from './TaskItemList';

describe('TaskList Component', () => {
  const wrapper = shallow(<TaskItemList tasks={[]} />);

  it('Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

});
