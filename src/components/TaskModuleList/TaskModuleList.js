import React from 'react';
import TaskModule from './TaskModule/TaskModule';
import classes from './TaskModuleList.scss';

const TaskModuleList = ({
  taskModules,
  addNewTask,
  toggleTask,
  removeTask,
  removeTaskModule,
  sortByProp,
  sortByExpiration,
  toggleModal,
}) => {
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
};

export default TaskModuleList;
