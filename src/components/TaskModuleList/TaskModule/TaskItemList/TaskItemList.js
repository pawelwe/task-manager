import React from 'react';
import Task from './TaskItem/Task';
import classes from './TaskItemList.css';

const TaskItemList = ({ tasks, toggleTask, removeTask, moduleId }) => {
  if(tasks.length < 1) {
    return null;
  }

  return (
    <ul className={classes.TaskItemList}>
      {tasks.map(task => {
        return (
          <Task
            key={task.id}
            id={task.id}
            {...task}
            toggleTask={toggleTask}
            removeTask={removeTask}
            moduleId={moduleId}
          />
        );
      })}
    </ul>
  );
};

export default TaskItemList;
