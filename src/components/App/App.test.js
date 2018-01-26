import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

describe('App Component', () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  const moduleName = 'Module 1';
  const taskName = 'Task 1';
  let moduleId = null;
  let taskId = null;

  it('Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('handleAddTaskModule method', () => {
    expect(instance.handleAddTaskModule(moduleName)[0].title).toEqual(moduleName);
  })

  it('handleAddTask method', () => {
    moduleId = instance.renderTaskModules().props.taskModules[0].id;
    expect(instance.handleAddTask(moduleId, taskName, 10, 10)[0].tasks[0].name).toEqual(taskName);
  })

  it('handleToggleTask method', () => {
    taskId = instance.renderTaskModules().props.taskModules[0].tasks[0].id;
    expect(instance.handleToggleTask(moduleId, taskId)[0].tasks[0].completed).toEqual(true);
  })

  it('renderTaskModules method', () => {
    expect(instance.renderTaskModules().props.taskModules[0].title).toEqual(moduleName);
  })

  it('handleSortByProp method', () => {
    instance.handleAddTask(moduleId, 'Task 2', 1, 1);
    expect(instance.handleSortByProp(moduleId, 'priority')[0].tasks[0].priority).toEqual(10);
  })

  it('handleSortByExpiration method', () => {
    expect(instance.handleSortByExpiration(moduleId)[0].tasks[0].expirationPeriod).toEqual(1);
  })

  it('handleRemoveTask method', () => {
    expect(instance.handleRemoveTask(moduleId, taskId)[0].tasks.length).toEqual(1);
  })

  it('handleRemoveTaskModule method', () => {
    expect(instance.handleRemoveTaskModule(moduleId).length).toEqual(0);
  })

});