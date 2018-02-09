import React, { Component } from 'react';
import uuid from 'uuid';
import isEqual from 'lodash.isequal';

import {
  findModuleToUpdateIndex,
  sortBy,
  calculateExpiration,
} from '../../utils/utils';
import { handleSaveState, handleLoadState } from '../../utils/persistState';

// HOC's
import alertContainer from '../../hoc/alertContainer';
import asyncComponent from '../../hoc/asyncComponent';

// Components
import AddTaskModule from '../AddTaskModule/AddTaskModule';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import ModalContainer from '../Modal/ModalContainer';

// Styles
import classes from './App.scss';
import wheelIcon from '../../images/wheel-icon.svg';

// Async Components (test)
const TaskModuleList = asyncComponent(() =>
  import('../TaskModuleList/TaskModuleList'),
);

class App extends Component {
  state = {
    taskModules: [],
    timer: 0,
  };

  expiredTasksCheckInterval = 10000;

  componentWillMount() {
    const savedState = handleLoadState();

    this.setState({
      taskModules:
        savedState && savedState.taskModules
          ? this.initModules(savedState.taskModules, true)
          : [],
    });

    this.expirationInterval = setInterval(
      this.checkExpiredTasks,
      this.expiredTasksCheckInterval,
    );
  }

  componentDidUpdate(prevProps, prevState) {
    console.info('App did updated!');
  }

  componentWillUnmount() {
    clearInterval(this.expirationInterval);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextState.taskModules, this.state.taskModules);
  }

  initModules(modules, resetEditMode) {
    console.log('Init');

    return modules.map(module => {
      return module.tasks && module.tasks.length > 0
        ? {
            ...module,
            tasksSortedBy: 'expiration',
            tasks: module.tasks
              .sort((a, b) => {
                return (
                  calculateExpiration(
                    a.creationDate,
                    a.expirationPeriod,
                    a.timeFrame,
                  ).unifiedValue -
                  calculateExpiration(
                    b.creationDate,
                    b.expirationPeriod,
                    b.timeFrame,
                  ).unifiedValue
                );
              })
              .map(task => {
                return {
                  ...task,
                  editMode: !resetEditMode ? task.editMode : false,
                  expiresIn:
                    calculateExpiration(
                      task.creationDate,
                      task.expirationPeriod,
                      task.timeFrame,
                    ).unifiedValue > 0
                      ? calculateExpiration(
                          task.creationDate,
                          task.expirationPeriod,
                          task.timeFrame,
                        ).unifiedValue
                      : 0,
                };
              }),
          }
        : module;
    });
  }

  checkExpiredTasks = () => {
    if (this.state.taskModules.length > 0) {
      const sortedModules = this.initModules(this.state.taskModules, false);
      this.setState((prevState, props) => {
        return {
          timer: prevState.timer + this.expiredTasksInterval / 1000,
          taskModules: sortedModules,
        };
      });
    }
  };

  handleAddTask = (
    moduleId,
    newTaskName,
    priority,
    expirationPeriod,
    timeFrame,
  ) => {
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
      timeFrame: timeFrame,
      editMode: false,
    };

    this.setState(
      {
        taskModules: updatedModules.map((module, index) => {
          if (index !== moduleToUpdateIndex) {
            return module;
          }
          return {
            ...module,
            tasks: [...module.tasks, newTask],
          };
        }),
      },
      () => handleSaveState(this.state.taskModules),
    );
    return updatedModules;
  };

  toggleTaskEditMode = (moduleId, taskId, toggle) => {
    console.log('toggleTaskEditMode', moduleId, taskId);
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

    this.setState(
      {
        taskModules: updatedModules.map((module, index) => {
          if (index !== moduleToUpdateIndex) {
            return module;
          }
          return {
            ...module,
            tasks: module.tasks.map((task, index) => {
              if (index !== taskToUpdateIndex) {
                return {
                  ...task,
                  editMode: false,
                };
              }
              return {
                ...task,
                editMode: toggle,
              };
            }),
          };
        }),
      },
      () => handleSaveState(this.state.taskModules),
    );
  };

  handleUpdateTask = (
    moduleId,
    taskId,
    newTaskName,
    newPriority,
    newExpirationPeriod,
    newTimeFrame,
  ) => {
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

    this.setState(
      {
        taskModules: updatedModules.map((module, index) => {
          if (index !== moduleToUpdateIndex) {
            return module;
          }
          return {
            ...module,
            tasks: module.tasks.map((task, index) => {
              if (index !== taskToUpdateIndex) {
                return task;
              }
              return {
                ...task,
                name: newTaskName,
                priority: parseInt(newPriority, 10),
                expirationPeriod: parseInt(newExpirationPeriod, 10),
                timeFrame: newTimeFrame,
                editMode: false,
              };
            }),
          };
        }),
      },
      () => handleSaveState(this.state.taskModules),
    );
  };

  handleRemoveTask = (moduleId, taskId) => {
    const updatedModules = [...this.state.taskModules];
    const moduleToUpdateIndex = findModuleToUpdateIndex(
      updatedModules,
      moduleId,
    );

    this.setState(
      {
        taskModules: updatedModules.map((module, index) => {
          if (index !== moduleToUpdateIndex) {
            return module;
          }
          return {
            ...module,
            tasks: module.tasks.filter(task => {
              return task.id !== taskId;
            }),
          };
        }),
      },
      () => handleSaveState(this.state.taskModules),
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

    this.setState(
      {
        taskModules: updatedModules.map((module, index) => {
          if (index !== moduleToUpdateIndex) {
            return module;
          }
          return {
            ...module,
            tasks: module.tasks.map((task, index) => {
              if (index !== taskToUpdateIndex) {
                return task;
              }
              return {
                ...task,
                completed: !task.completed,
              };
            }),
          };
        }),
      },
      () => handleSaveState(this.state.taskModules),
    );
    return updatedModules;
  };

  handleAddTaskModule = moduleName => {
    const taskModules = [...this.state.taskModules];
    const newModule = {
      title: moduleName,
      id: uuid.v4(),
      tasks: [],
      sortAsc: true,
      tasksSortedBy: 'creationDate',
    };
    const newTaskModules = [...taskModules, newModule];
    this.setState(
      {
        taskModules: newTaskModules,
      },
      () => handleSaveState(this.state.taskModules),
    );
    return newTaskModules;
  };

  handleUpdateModuleTitle = (moduleId, newTaskModuleTitle) => {
    const updatedModules = [...this.state.taskModules];
    const moduleToUpdateIndex = findModuleToUpdateIndex(
      updatedModules,
      moduleId,
    );
    this.setState(
      {
        taskModules: updatedModules.map((module, index) => {
          if (index !== moduleToUpdateIndex) {
            return module;
          }
          return {
            ...module,
            tasks: [...module.tasks],
            title: newTaskModuleTitle,
          };
        }),
      },
      () => handleSaveState(this.state.taskModules),
    );
    return updatedModules;
  };

  handleRemoveTaskModule = (moduleId, cb) => {
    let allModules = [...this.state.taskModules];
    let updatedModules = allModules.filter(module => {
      return module.id !== moduleId;
    });
    this.setState(
      {
        taskModules: updatedModules,
      },
      () => handleSaveState(this.state.taskModules),
      cb ? cb() : false,
    );
    return updatedModules;
  };

  handleConfirmRemoveTaskModule = id => {
    console.warn('Module to remove: ', id);
    this.modalContainer.toggleModal('deleteModuleModal', true, id);
  };

  handleSortByProp = (moduleId, prop) => {
    const updatedModules = [...this.state.taskModules];
    const moduleToUpdateIndex = findModuleToUpdateIndex(
      updatedModules,
      moduleId,
    );
    this.setState(
      {
        taskModules: updatedModules.map((module, index) => {
          if (index !== moduleToUpdateIndex) {
            return module;
          }
          return {
            ...module,
            tasks: module.tasks.sort(
              sortBy(prop, updatedModules[moduleToUpdateIndex].sortAsc),
            ),
            sortAsc: !updatedModules[moduleToUpdateIndex].sortAsc,
            tasksSortedBy: prop,
          };
        }),
      },
      () => handleSaveState(this.state.taskModules),
    );
    return updatedModules;
  };

  handleSortByExpiration = moduleId => {
    const updatedModules = [...this.state.taskModules];
    const moduleToUpdateIndex = findModuleToUpdateIndex(
      updatedModules,
      moduleId,
    );
    this.setState(
      {
        taskModules: updatedModules.map((module, index) => {
          if (index !== moduleToUpdateIndex) {
            return module;
          }
          return {
            ...module,
            tasks: module.tasks.sort((a, b) => {
              if (updatedModules[moduleToUpdateIndex].sortAsc) {
                return (
                  calculateExpiration(
                    a.creationDate,
                    a.expirationPeriod,
                    a.timeFrame,
                  ).unifiedValue +
                  calculateExpiration(
                    b.creationDate,
                    b.expirationPeriod,
                    b.timeFrame,
                  ).unifiedValue
                );
              } else {
                return (
                  calculateExpiration(
                    a.creationDate,
                    a.expirationPeriod,
                    a.timeFrame,
                  ).unifiedValue -
                  calculateExpiration(
                    b.creationDate,
                    b.expirationPeriod,
                    b.timeFrame,
                  ).unifiedValue
                );
              }
            }),
            sortAsc: !updatedModules[moduleToUpdateIndex].sortAsc,
            tasksSortedBy: 'expiration',
          };
        }),
      },
      () => handleSaveState(this.state.taskModules),
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
          <TaskModuleList
            taskModules={this.state.taskModules}
            addNewTask={this.handleAddTask}
            toggleTask={this.handleToggleTask}
            removeTask={this.handleRemoveTask}
            removeTaskModule={this.handleRemoveTaskModule}
            sortByExpiration={this.handleSortByExpiration}
            sortByProp={this.handleSortByProp}
            toggleModal={this.props.toggleModal}
            timer={this.state.timer}
            handleConfirmRemoveTaskModule={this.handleConfirmRemoveTaskModule}
            toggleAlert={this.props.toggleAlert}
            editModuleTitle={this.handleUpdateModuleTitle}
            editTask={this.handleUpdateTask}
            toggleTaskEditMode={this.toggleTaskEditMode}
          />
          <AddTaskModule
            addTaskModule={this.handleAddTaskModule}
            toggleAlert={this.props.toggleAlert}
          />
          <ModalContainer
            onRef={ref => (this.modalContainer = ref)}
            removeTaskModule={this.handleRemoveTaskModule}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

export default alertContainer(App);
