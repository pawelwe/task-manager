import React, { Component } from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';
import TransitionGroup from 'react-transition-group/TransitionGroup';

import TaskModule from './TaskModule/TaskModule';
import classes from './TaskModuleList.scss';

class TaskModuleList extends Component {
  componentDidUpdate(prevProps) {
    console.info('Task Module List updated!');
  }

  render() {
    let {
      taskModules,
      addNewTask,
      toggleTask,
      removeTask,
      removeTaskModule,
      sortByProp,
      sortByExpiration,
      toggleModal,
      handleConfirmRemoveTaskModule,
      toggleAlert,
      editModuleTitle,
      editTask,
      toggleTaskEditMode,
      doSearch,
    } = this.props;
    if (taskModules.length < 1) {
      return (
        <div className="container container_content">
          <h5>No task modules...</h5>
          <br />
        </div>
      );
    }

    return (
      <TransitionGroup component="ul" className={`${classes.TaskModuleList}`}>
        {taskModules.map(module => {
          return (
            <CSSTransition
              key={module.id}
              classNames="fade"
              timeout={{ enter: 450, exit: 250 }}
            >
              <TaskModule
                {...module}
                moduleId={module.id}
                tasks={module.tasks.filter(task =>
                  task.name.includes(module.searchTerm),
                )}
                addNewTask={addNewTask}
                toggleTask={toggleTask}
                removeTask={removeTask}
                removeTaskModule={removeTaskModule}
                sortByProp={sortByProp}
                sortByExpiration={sortByExpiration}
                toggleModal={toggleModal}
                handleConfirmRemoveTaskModule={handleConfirmRemoveTaskModule}
                toggleAlert={toggleAlert}
                editModuleTitle={editModuleTitle}
                editTask={editTask}
                toggleTaskEditMode={toggleTaskEditMode}
                searchTerm={module.searchTerm}
                doSearch={doSearch}
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    );
  }
}

export default TaskModuleList;
