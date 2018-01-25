import React, { Component } from 'react';
import uuid from 'uuid';
import toastr from 'toastr';
import {
  findModuleToUpdateIndex,
  sortBy,
  calculateExpiration,
} from '../../utils/utils';

import AddTaskModule from '../AddTaskModule/AddTaskModule';
import TaskModuleList from '../TaskModuleList/TaskModuleList';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import classes from './App.css';
import wheelIcon from '../../images/wheel-icon.svg';

class App extends Component {
  state = {
    taskModules: [],
  };

  renderTaskModules = () => {
    const taskModules = this.state.taskModules;
    if (taskModules.length < 1) {
      return (
        <div className="container container_content">
          <h5>No task modules...</h5>
          <br />
        </div>
      );
    }
    return (
      <TaskModuleList
        taskModules={taskModules}
        addNewTask={this.handleAddTask}
        toggleTask={this.handleToggleTask}
        removeTask={this.handleRemoveTask}
        removeTaskModule={this.handleRemoveTaskModule}
        sortByPriority={this.handleSortByPriority}
        sortByExpiration={this.handleSortByExpiration}
      />
    );
  };

  handleAddTask = (moduleId, newTaskName, priority, expirationPeriod) => {
    if (!newTaskName || !priority || !expirationPeriod) {
      toastr.info('Please correct your input!');
      return;
    }
    const updatedModules = [...this.state.taskModules];
    const moduleToUpdateIndex = findModuleToUpdateIndex(
      updatedModules,
      moduleId,
    );
    const newTask = {
      name: newTaskName,
      id: uuid.v4(),
      completed: false,
      priority: parseInt(priority, 10),
      creationDate: Date.now(),
      expirationPeriod: parseInt(expirationPeriod, 10),
    };
    updatedModules[moduleToUpdateIndex].tasks.push(newTask);
    this.setState({
      taskModules: updatedModules,
    });
    return updatedModules;
  };

  handleRemoveTask = (moduleId, taskId) => {
    const updatedModules = [...this.state.taskModules];
    const moduleToUpdateIndex = findModuleToUpdateIndex(
      updatedModules,
      moduleId,
    );
    const updatedModuleTasks = updatedModules[
      moduleToUpdateIndex
    ].tasks.filter(task => {
      return task.id !== taskId;
    });
    updatedModules[moduleToUpdateIndex].tasks = updatedModuleTasks;
    this.setState({
      taskModules: updatedModules,
    });
    return updatedModules;
  };

  handleToggleTask = (moduleId, taskId) => {
    const updatedModules = [...this.state.taskModules];
    const moduleToUpdateIndex = findModuleToUpdateIndex(
      updatedModules,
      moduleId,
    );
    const taskToUpdateIndex = updatedModules[
      moduleToUpdateIndex
    ].tasks.findIndex(task => {
      return task.id === taskId;
    });
    updatedModules[moduleToUpdateIndex].tasks[
      taskToUpdateIndex
    ].completed = !updatedModules[moduleToUpdateIndex].tasks[taskToUpdateIndex]
      .completed;
    this.setState({
      taskModules: updatedModules,
    });
    return updatedModules;
  };

  handleAddTaskModule = moduleName => {
    if (!moduleName) {
      toastr.info('Please correct your input!');
      return;
    }
    const taskModules = this.state.taskModules;
    const newModule = {
      title: moduleName,
      id: uuid.v4(),
      tasks: [],
      sortAsc: true,
    };
    const newTaskModules = [...taskModules, newModule];
    this.setState({
      taskModules: newTaskModules,
    });
    return newTaskModules;
  };

  handleRemoveTaskModule = moduleId => {
    const that = this;
    let allModules = [...that.state.taskModules];
    let updatedModules = allModules.filter(module => {
      return module.id !== moduleId;
    });
    const toastrOptions = {
      closeButton: true,
      timeOut: 5000,
      progressBar: true,
      tapToDismiss: false,
      onclick() {
        toastr.clear();
        that.setState({
          taskModules: updatedModules,
        });
      },
      onCloseClick() {
        toastr.clear();
      },
    };
    toastr['info'](
      `<div><span class="CloseDialog">Yes</span></div>`,
      `Do you really want to delete module ${moduleId}?`,
      toastrOptions,
    );
    return updatedModules;
  };

  handleSortByPriority = moduleId => {
    const updatedModules = [...this.state.taskModules];
    const moduleToUpdateIndex = findModuleToUpdateIndex(
      updatedModules,
      moduleId,
    );
    updatedModules[moduleToUpdateIndex].tasks.sort(
      sortBy('priority', updatedModules[moduleToUpdateIndex].sortAsc),
    );
    updatedModules[moduleToUpdateIndex].sortAsc = !updatedModules[
      moduleToUpdateIndex
    ].sortAsc;
    this.setState({
      taskModules: updatedModules,
    });
    return updatedModules;
  };

  handleSortByExpiration = moduleId => {
    const updatedModules = [...this.state.taskModules];
    const moduleToUpdateIndex = findModuleToUpdateIndex(
      updatedModules,
      moduleId,
    );
    updatedModules[moduleToUpdateIndex].sortAsc = !updatedModules[
      moduleToUpdateIndex
    ].sortAsc;
    updatedModules[moduleToUpdateIndex].tasks.sort((a, b) => {
      if (updatedModules[moduleToUpdateIndex].sortAsc) {
        return (
          calculateExpiration(a.creationDate, a.expirationPeriod) -
          calculateExpiration(b.creationDate, b.expirationPeriod)
        );
      } else {
        return (
          calculateExpiration(b.creationDate, b.expirationPeriod) -
          calculateExpiration(a.creationDate, a.expirationPeriod)
        );
      }
    });
    this.setState({
      taskModules: updatedModules,
    });
    return updatedModules;
  };

  render() {
    return (
      <div className={`${classes.App} container`}>
        <ErrorBoundary>
          <header className={classes.App_header}>
            <h1>
              <img
                className={classes.App_logo}
                src={wheelIcon}
                alt="wheel-icon"
              />Task Manager
            </h1>
          </header>
          {this.renderTaskModules()}
          <AddTaskModule addTaskModule={this.handleAddTaskModule} />
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;
