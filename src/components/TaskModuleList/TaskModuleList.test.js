import React from 'react';
import { shallow } from 'enzyme';
import TaskModuleList from './TaskModuleList';

describe('TaskModuleList Component', () => {
  const wrapper = shallow(<TaskModuleList taskModules={[]} />);

  it('Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

});
