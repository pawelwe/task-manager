import React, { Component } from 'react';
import throttle from 'lodash.throttle';
// import debounce from 'lodash.debounce';
import uuid from 'uuid';
import {
  findModuleToUpdateIndex,
  sortBy,
  calculateExpiration,
} from '../../utils/utils';

import AddTaskModule from '../AddTaskModule/AddTaskModule';
import TaskModuleList from '../TaskModuleList/TaskModuleList';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Modal from '../Modal/Modal';
import Alert from '../Alerts/Alert';
import DeleteTaskModuleDialog from '../Dialogs/DeleteTaskModuleDialog';

import classes from './App.scss';
import wheelIcon from '../../images/wheel-icon.svg';

class App extends Component {
  state = {
    taskModules: [],
    timer: 0,
    modals: {
      deleteModuleModal: {
        shown: false,
        params: null,
      },
    },
    alerts: {
      addTaskInputAlert: {
        shown: false,
        text: 'Please correct new task fields',
      },
      addModuleInputAlert: {
        shown: false,
        text: 'Please correct new module fields',
      },
    },
    validation: {
      taskInput: {
        taskName: {
          error: false,
          msg: 'Not valid name',
        },
        priority: {
          error: false,
          msg: 'Should be a number 1-10',
        },
        expiration: {
          error: false,
          msg: 'Should be a number',
        },
      },
      moduleInput: {
        moduleName: {
          error: false,
          msg: 'Not valid name',
        },
      },
    },
  };

  expiredTasksInterval = 15000;

  alertDisplayTime = 4000;

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
        toggleModal={this.toggleModal}
      />
    );
  };

  handleAddTask = (moduleId, newTaskName, priority, expirationPeriod) => {
    if (!newTaskName || !priority || !expirationPeriod) {
      this.toggleAlert('addTaskInputAlert', true);
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
      this.toggleAlert('addModuleInputAlert', true);
      return;
    }
    const taskModules = this.state.taskModules;
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
      () => this.handleSaveState(),
    );
    return newTaskModules;
  };

  toggleModal = (modalName, toggle = false, params) => {
    const newModals = { ...this.state.modals };
    newModals[modalName].shown = toggle;
    if (params) {
      newModals[modalName].params = params;
    }
    this.setState({
      modals: newModals,
    });
  };

  toggleAlert = (alertName, toggle) => {
    console.info('Alert:', alertName, toggle ? 'on' : 'off');
    if (!alertName) {
      console.warn('No alert name!');
      return;
    }
    let nextAlerts = { ...this.state.alerts };

    // Clear previous timeouts
    Object.keys(this.state.alerts).forEach(alert => {
      clearTimeout(this[`${alert}Timeout`]);
      this[`${alert}Timeout`] = undefined;
    });

    // If next alert
    if (toggle) {
      let alertsToHide = Object.keys(nextAlerts)
        .map(alert => {
          // Hide previous alerts
          return {
            [alert]: {
              ...nextAlerts[alert],
              shown: false,
            },
          };
        })
        .reduce((result, item) => {
          // Convert to Object
          let key = Object.keys(item)[0];
          result[key] = item[key];
          return result;
        }, {});

      // AutoHide alerts
      this[`${alertName}Timeout`] = setTimeout(() => {
        this.toggleAlert(alertName, false);
      }, this.alertDisplayTime);

      nextAlerts = alertsToHide;
    }

    // Show next alert, as the all alerts are hidden at this point
    if (!nextAlerts[alertName]) return;
    nextAlerts[alertName].shown = toggle;

    this.setState(() => {
      return {
        alerts: nextAlerts,
      };
    });
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
      () => this.handleSaveState(),
      cb ? cb() : false,
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
    updatedModules[moduleToUpdateIndex].tasksSortedBy = prop;
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
    updatedModules[moduleToUpdateIndex].tasksSortedBy = 'expiration';
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
        <Modal
          id="deleteModuleModal"
          show={this.state.modals.deleteModuleModal.shown}
          toggle={this.toggleModal}
        >
          <DeleteTaskModuleDialog
            confirmModuleDeletion={this.handleRemoveTaskModule}
            hideModal={this.toggleModal}
            moduleToDeleteId={this.state.modals.deleteModuleModal.params}
            modalId="deleteModuleModal"
          />
        </Modal>
        <Alert
          id="addModuleInputAlert"
          show={this.state.alerts.addModuleInputAlert.shown}
          action={this.toggleAlert}
        >
          <p>{this.state.alerts.addModuleInputAlert.text}</p>
        </Alert>
        <Alert
          id="addTaskInputAlert"
          show={this.state.alerts.addTaskInputAlert.shown}
          action={this.toggleAlert}
        >
          <p>{this.state.alerts.addTaskInputAlert.text}</p>
        </Alert>
      </div>
    );
  }
}

export default App;
