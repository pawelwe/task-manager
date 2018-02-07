import React from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Task from './TaskItem/Task';
import classes from './TaskItemList.scss';

const TaskItemList = ({ tasks, toggleTask, removeTask, moduleId }) => {
  return (
    <TransitionGroup component="ul" className={`${classes.TaskItemList}`}>
      {tasks.map(task => {
        return (
          <CSSTransition
            key={task.id}
            classNames="fade"
            timeout={{ enter: 450, exit: 250 }}
          >
            <Task
              id={task.id}
              {...task}
              toggleTask={toggleTask}
              removeTask={removeTask}
              moduleId={moduleId}
            />
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
};

export default TaskItemList;
