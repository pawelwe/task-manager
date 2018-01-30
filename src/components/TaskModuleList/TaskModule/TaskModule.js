import React, { Component } from 'react';
import AddTask from './AddTask/AddTask';
import Filter from './Filter/Filter';
import TaskItemList from './TaskItemList/TaskItemList';
import classes from './TaskModule.scss';

class TaskModule extends Component {
  state = {
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
    },
  };

  componentDidUpdate() {
    console.info('Module updated!');
  }

  render() {
    let {
      title,
      tasks,
      addNewTask,
      toggleTask,
      moduleId,
      sortByProp,
      sortByExpiration,
      removeTask,
      sortAsc,
      tasksSortedBy,
      toggleModal,
    } = this.props;
    return (
      <li className={`${classes.TaskModule} fadeIn`}>
        <section className={classes.TaskModule_content}>
          <h4 className={classes.TaskModule_title}>{title}</h4>
          <span
            id="removeTaskModule"
            onClick={() => toggleModal('deleteModuleModal', true, moduleId)}
            className="removeBtn"
          />
          <div className={classes.TaskModule_filterBox}>
            <strong>Sort tasks by:</strong>
            <div className={classes.TaskModule_filters}>
              <Filter
                sortBy={sortByProp}
                text="Priority"
                filter="priority"
                moduleId={moduleId}
                tasksSortedBy={tasksSortedBy}
              />
              <Filter
                sortBy={sortByExpiration}
                text="Expiration"
                filter="expiration"
                moduleId={moduleId}
                tasksSortedBy={tasksSortedBy}
              />
              <Filter
                sortBy={sortByProp}
                text="Completion"
                filter="completed"
                moduleId={moduleId}
                tasksSortedBy={tasksSortedBy}
              />
              <Filter
                sortBy={sortByProp}
                text="Creation"
                filter="creationDate"
                moduleId={moduleId}
                tasksSortedBy={tasksSortedBy}
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
  }
}

export default TaskModule;
