import React from 'react';
import AddTask from './AddTask/AddTask';
import Filter from './Filter/Filter';
import TaskItemList from './TaskItemList/TaskItemList';
import classes from './TaskModule.css';

const TaskModule = ({
  title,
  tasks,
  addNewTask,
  toggleTask,
  moduleId,
  sortByPriority,
  sortByExpiration,
  removeTask,
  removeTaskModule,
  sortAsc,
}) => {
  return (
    <li className={`${classes.TaskModule} fadeIn`}>
      <section className={classes.TaskModule_content}>
        <h4 className={classes.TaskModule_title}>{title}</h4>
        <span
          id="removeTaskModule"
          onClick={() => removeTaskModule(moduleId)}
          className="removeBtn"
        />
        <div className={classes.TaskModule_filterBox}>
          <Filter
            sortBy={sortByPriority}
            filter={'Priority'}
            moduleId={moduleId}
          />
          <Filter
            sortBy={sortByExpiration}
            filter={'Expiration'}
            moduleId={moduleId}
          />
          <span className={classes.TaskModule_filterDirArrow}>
            {sortAsc ? '↑' : '↓'}
          </span>
        </div>
        <ul className={classes.TaskList}>
          {tasks && tasks.length < 1 && (
            <li>
              <h5>No tasks in current module...</h5>
              <br />
            </li>
          )}
          <TaskItemList
            tasks={tasks}
            toggleTask={toggleTask}
            removeTask={removeTask}
            moduleId={moduleId}
          />
        </ul>
        <AddTask addNewTask={addNewTask} moduleId={moduleId} />
      </section>
    </li>
  );
};

export default TaskModule;
