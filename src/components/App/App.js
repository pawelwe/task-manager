import React, { Component } from 'react';
import throttle from 'lodash.throttle';
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
    timer: 0,
  };

  expiredTasksInterval = 15000;

  componentDidMount() {
    this.handleLoadState();
    this.interval = setInterval(
      this.checkExpiredTasks,
      this.expiredTasksInterval,
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  checkExpiredTasks = () => {
    if (this.state.taskModules.length > 0) {
      const sortedModules = this.state.taskModules.map(module => {
        return module.tasks && module.tasks.length > 0
          ? {
              ...module,
              tasks: module.tasks.sort((a, b) => {
                return (
                  calculateExpiration(a.creationDate, a.expirationPeriod) -
                  calculateExpiration(b.creationDate, b.expirationPeriod)
                );
              }),
            }
          : module;
      });
      this.setState((prevState, props) => {
        return {
          timer: prevState.timer + this.expiredTasksInterval / 1000,
          taskModules: sortedModules,
        };
      });
    }
  };

  handleSaveState() {
    const handleSavingToStorage = () => {
      try {
        const taskManagerApp = JSON.stringify(
          Object.assign({}, { taskModules: this.state.taskModules }),
        );
        localStorage.setItem('taskManagerApp', taskManagerApp);
        console.info('Task Manager App State saved...');
        return taskManagerApp;
      } catch (err) {
        console.warn(err);
      }
    };
    const throttledHandleSavingToStorage = throttle(
      handleSavingToStorage,
      1000,
    );
    return throttledHandleSavingToStorage();
  }

  handleLoadState() {
    try {
      const taskManagerApp = JSON.parse(localStorage.getItem('taskManagerApp'));
      if (taskManagerApp === null) {
        return undefined;
      }
      this.setState({
        taskModules: taskManagerApp.taskModules,
      });
      console.info('Task Manager App State loaded...');
      return taskManagerApp;
    } catch (err) {
      return undefined;
    }
  }

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
        sortByExpiration={this.handleSortByExpiration}
        sortByProp={this.handleSortByProp}
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
    this.setState(
      {
        taskModules: updatedModules,
      },
      () => this.handleSaveState(),
    );
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
    this.setState(
      {
        taskModules: updatedModules,
      },
      () => this.handleSaveState(),
    );
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
    this.setState(
      {
        taskModules: updatedModules,
      },
      () => this.handleSaveState(),
    );
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
      sortTasksBy: 'creationDate',
    };
    const newTaskModules = [...taskModules, newModule];
    this.setState(
      {
        taskModules: newTaskModules,
      },
      () => this.handleSaveState(),
    );
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
        that.setState(
          {
            taskModules: updatedModules,
          },
          () => that.handleSaveState(),
        );
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

  handleSortByProp = (moduleId, prop) => {
    const updatedModules = [...this.state.taskModules];
    const moduleToUpdateIndex = findModuleToUpdateIndex(
      updatedModules,
      moduleId,
    );
    updatedModules[moduleToUpdateIndex].tasks.sort(
      sortBy(prop, updatedModules[moduleToUpdateIndex].sortAsc),
    );
    updatedModules[moduleToUpdateIndex].sortAsc = !updatedModules[
      moduleToUpdateIndex
    ].sortAsc;
    updatedModules[moduleToUpdateIndex].sortTasksBy = prop;
    this.setState(
      {
        taskModules: updatedModules,
      },
      () => this.handleSaveState(),
    );
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
    updatedModules[moduleToUpdateIndex].sortTasksBy = 'expiration';
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
    this.setState(
      {
        taskModules: updatedModules,
      },
      () => this.handleSaveState(),
    );
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
