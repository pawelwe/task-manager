import React from 'react';
import toastr from 'toastr';
import classes from './AddTask.css';

const AddTask = ({ addNewTask, moduleId }) => {
  let taskName, expirationPeriod, priority, confirm;
  return (
    <footer>
      <input
        placeholder="Task name"
        className={classes.AddTask_input}
        ref={node => (taskName = node)}
      />
      <input
        type="number"
        placeholder="Priority (1-10)"
        min="1"
        max="10"
        className={classes.AddTask_input}
        ref={node => (priority = node)}
      />
      <input
        type="number"
        min="1"
        max="24"
        placeholder="Expiration date (h)"
        className={classes.AddTask_input}
        ref={node => (expirationPeriod = node)}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            confirm.click();
          }
        }}
      />
      <button
        id="addNewTask"
        ref={node => (confirm = node)}
        onClick={() => {
          addNewTask(
            moduleId,
            taskName.value,
            priority.value,
            expirationPeriod.value,
          );
          taskName.value = priority.value = expirationPeriod.value = '';
        }}
        className={classes.AddTask_btn}
      >
        + Add New Task
      </button>
    </footer>
  );
};

export default AddTask;
