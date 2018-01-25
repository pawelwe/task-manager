import React from 'react';
import TaskModule from './TaskModule/TaskModule';
import classes from './TaskModuleList.css';

const TaskModuleList = ({
  taskModules,
  addNewTask,
  toggleTask,
  removeTask,
  removeTaskModule,
  sortByPriority,
  sortByExpiration,
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
            sortByPriority={sortByPriority}
            sortByExpiration={sortByExpiration}
          />
        );
      })}
    </ul>
  );
};

export default TaskModuleList;
