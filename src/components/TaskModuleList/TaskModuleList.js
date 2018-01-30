import React, { Component } from 'react';
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
      <ul className={`${classes.TaskModuleList}`}>
        {taskModules.map(module => {
          return (
            <TaskModule
              moduleId={module.id}
              key={module.id}
              addNewTask={addNewTask}
              toggleTask={toggleTask}
              removeTask={removeTask}
              removeTaskModule={removeTaskModule}
              {...module}
              sortByProp={sortByProp}
              sortByExpiration={sortByExpiration}
              toggleModal={toggleModal}
            />
          );
        })}
      </ul>
    );
  }
}

export default TaskModuleList;
