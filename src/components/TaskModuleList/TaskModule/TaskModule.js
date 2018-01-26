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
  sortByProp,
  sortByExpiration,
  removeTask,
  removeTaskModule,
  sortAsc,
  sortTasksBy,
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
          <strong>Sort by:</strong>
          <div className={classes.TaskModule_filters}>
            <Filter
              sortBy={sortByProp}
              text={'Priority'}
              filter={'priority'}
              moduleId={moduleId}
              sortTasksBy={sortTasksBy}
            />
            <Filter
              sortBy={sortByExpiration}
              text={'Expiration'}
              filter={'expiration'}
              moduleId={moduleId}
              sortTasksBy={sortTasksBy}
            />
            <Filter
              sortBy={sortByProp}
              text={'Completion'}
              filter={'completed'}
              moduleId={moduleId}
              sortTasksBy={sortTasksBy}
            />
            <Filter
              sortBy={sortByProp}
              text={'Creation'}
              filter={'creationDate'}
              moduleId={moduleId}
              sortTasksBy={sortTasksBy}
            />
          </div>
          <span className={classes.TaskModule_filterDirArrow}>
            {sortAsc ? '↑' : '↓'}
          </span>
        </div>
        <ul className={classes.TaskList}>
          {tasks &&
            tasks.length < 1 && (
              <li>
                <p>No tasks in current module...</p>
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
