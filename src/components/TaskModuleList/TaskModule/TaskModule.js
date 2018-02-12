import React, { Component } from 'react';
import AddTask from './AddTask/AddTask';
import Filter from './Filter/Filter';
import TaskItemList from './TaskItemList/TaskItemList';
import Input from '../../Inputs/Input';
import classes from './TaskModule.scss';
import filterIcon from '../../../images/filter-icon.svg';

class TaskModule extends Component {
  cachedModuleTitle = null;

  componentDidUpdate() {
    console.info('Module updated!');
  }

  handleTitleInputChange = e => {
    this.cachedModuleTitle = e.target.value;
    if (e.key === 'Enter') {
      this.confirmNewModuleTitle(e.target.value);
    }
  };

  handleEditModuleTitle = () => {
    this.titleHeader.style = 'display: none';
    this.editHeader.style = 'display: flex';
    this.titleInput.focus();
  };

  handleConfirmViaButton = () => {
    const newTitle = this.cachedModuleTitle
      ? this.cachedModuleTitle
      : this.titleInput.value;
    this.props.editModuleTitle(this.props.moduleId, newTitle);
    this.titleHeader.style = 'display: flex';
    this.editHeader.style = 'display: none';
  };

  confirmNewModuleTitle = newTitle => {
    this.props.editModuleTitle(this.props.moduleId, newTitle);
    this.titleHeader.style = 'display: flex';
    this.editHeader.style = 'display: none';
  };

  handleResetTitle = () => {
    setTimeout(() => {
      this.titleInput.value = this.props.title;
      this.cachedModuleTitle = null;
      this.titleHeader.style = 'display: flex';
      this.editHeader.style = 'display: none';
    }, 200);
  };

  toggleFilter = () => {
    if (this.filterInput.style.width === '100%') {
      this.filterInput.style.width = 0;
    } else {
      this.filterInput.style.width = '100%';
      this.filterInput.focus();
    }
  };

  handleDoSearch = (e, moduleId) => {
    this.props.doSearch(moduleId, e.target.value);
  };

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
      handleConfirmRemoveTaskModule,
      toggleAlert,
      editTask,
      toggleTaskEditMode,
      searchTerm,
    } = this.props;

    return (
      <li className={classes.TaskModule}>
        <section className={classes.TaskModule_content}>
          <header
            ref={node => (this.titleHeader = node)}
            onClick={this.handleEditModuleTitle}
            className={classes.TaskModule_header}
          >
            <h4 className={classes.TaskModule_title}>{title}</h4>
            <div className={classes.TaskModule_toolbar}>
              <span
                data-title="Edit module title"
                className={`${classes.editIcon} tooltip`}
              >
                ✏
              </span>
              <span
                data-title="Remove module"
                id="removeTaskModule"
                onClick={e => {
                  e.stopPropagation();
                  handleConfirmRemoveTaskModule(moduleId);
                }}
                className={`${classes.TaskModule_removeBtn} tooltip`}
              >
                ✗
              </span>
            </div>
          </header>
          <header
            ref={node => (this.editHeader = node)}
            className={classes.TaskModule_header__edit}
          >
            <Input
              elementType="text"
              defaultValue={title}
              onKeyUp={e => {
                this.handleTitleInputChange(e);
              }}
              onBlur={this.handleResetTitle}
              inputref={node => (this.titleInput = node)}
              className={classes.TaskModule_title_edit}
            />
            <span
              onClick={this.handleConfirmViaButton}
              className={classes.confirmIcon}
            >
              ✓
            </span>
          </header>
          <div className={classes.TaskModule_sortBox}>
            <strong>Sort tasks by:</strong>
            <div className={classes.TaskModule_sorters}>
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
              {sortAsc ? '↥' : '↧'}
            </span>
          </div>
          <div className={classes.TaskModule_filterBox}>
            <div className={classes.TaskModule_filter}>
              <input
                className={classes.TaskModule_filterInput}
                style={{ width: 0 }}
                type="text"
                onChange={e => this.handleDoSearch(e, moduleId)}
                ref={node => (this.filterInput = node)}
              />
            </div>
            <span
              onClick={this.toggleFilter}
              className={`${classes.filterIcon} tooltip`}
              data-title="Toggle Filter"
            >
              <img src={filterIcon} alt="filter-icon" />
            </span>
          </div>
          <ul className={classes.TaskList}>
            {tasks &&
              tasks.length < 1 &&
              !searchTerm && (
                <li>
                  <p className={classes.TaskModule_noTasks}>
                    No tasks in current module...
                  </p>
                  <br />
                </li>
              )}
            {searchTerm &&
              !tasks.length && (
                <li>
                  <p className={classes.TaskModule_noTasks}>
                    No tasks found...
                  </p>
                  <br />
                </li>
              )}
            <TaskItemList
              tasks={tasks}
              toggleTask={toggleTask}
              removeTask={removeTask}
              moduleId={moduleId}
              toggleTaskEditMode={toggleTaskEditMode}
            />
          </ul>
          <AddTask
            toggleAlert={toggleAlert}
            addNewTask={addNewTask}
            moduleId={moduleId}
            editTask={editTask}
            tasks={tasks}
            toggleTaskEditMode={toggleTaskEditMode}
          />
        </section>
      </li>
    );
  }
}

export default TaskModule;
