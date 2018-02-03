import React from 'react';
import classes from './AddTask.scss';
import Input from '../../../Inputs/Input';

const AddTask = ({ addNewTask, moduleId }) => {
  let taskName, expirationPeriod, priority, confirm;

  return (
    <footer>
      <Input
        elementType="text"
        placeholder="Task name"
        inputref={node => (taskName = node)}
        className={classes.AddTask_input}
      />
      <Input
        elementType="number"
        placeholder="Priority (1-10)"
        min="1"
        max="10"
        className={classes.AddTask_input}
        inputref={node => (priority = node)}
      />
      <Input
        elementType="number"
        min="1"
        max="24"
        placeholder="Expiration time (minutes)"
        className={classes.AddTask_input}
        inputref={node => (expirationPeriod = node)}
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
          if (taskName.value && priority.value && expirationPeriod.value) {
            taskName.value = priority.value = expirationPeriod.value = '';
          }
        }}
        className={classes.AddTask_btn}
      >
        + Add New Task
      </button>
    </footer>
  );
};

export default AddTask;
