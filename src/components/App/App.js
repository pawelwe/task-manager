import React, { Component } from 'react';
import uuid from 'uuid';
import isEqual from 'lodash.isequal';
import {
  findModuleToUpdateIndex,
  sortBy,
  calculateExpiration,
} from '../../utils/utils';
import { handleSaveState, handleLoadState } from '../../utils/persistState';
import AddTaskModule from '../AddTaskModule/AddTaskModule';
import TaskModuleList from '../TaskModuleList/TaskModuleList';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import alertContainer from '../../hoc/alertContainer';

import ModalContainer from '../Modal/ModalContainer';
// import DeleteTaskModuleDialog from '../Dialogs/DeleteTaskModuleDialog';

import classes from './App.scss';
import wheelIcon from '../../images/wheel-icon.svg';

class App extends Component {
  state = {
    taskModules: [],
    timer: 0,
  };

  expiredTasksCheckInterval = 1000;

  componentWillMount() {
    const savedState = handleLoadState();
    this.setState({
      taskModules:
        savedState && savedState.taskModules ? savedState.taskModules : [],
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

  checkExpiredTasks = () => {
    if (this.state.taskModules.length > 0) {
      const sortedModules = this.state.taskModules.map(module => {
        return module.tasks && module.tasks.length > 0
          ? {
              ...module,
              tasks: module.tasks
                .sort((a, b) => {
                  return (
                    calculateExpiration(a.creationDate, a.expirationPeriod) -
                    calculateExpiration(b.creationDate, b.expirationPeriod)
                  );
                })
                .map(task => {
                  return {
                    ...task,
                    expiresIn:
                      calculateExpiration(
                        task.creationDate,
                        task.expirationPeriod,
                      ) > 0
                        ? calculateExpiration(
                            task.creationDate,
                            task.expirationPeriod,
                          )
                        : 0,
                  };
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

  handleAddTask = (moduleId, newTaskName, priority, expirationPeriod) => {
    if (!newTaskName || !priority || !expirationPeriod) {
      this.props.toggleAlert('addTaskInputAlert', true);
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
    if (!moduleName) {
      this.props.toggleAlert('addModuleInputAlert', true);
      return;
    }
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
                  calculateExpiration(a.creationDate, a.expirationPeriod) -
                  calculateExpiration(b.creationDate, b.expirationPeriod)
                );
              } else {
                return (
                  calculateExpiration(b.creationDate, b.expirationPeriod) -
                  calculateExpiration(a.creationDate, a.expirationPeriod)
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
          />
          <AddTaskModule addTaskModule={this.handleAddTaskModule} />
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
