import React from 'react';
import classes from './AddTaskModule.css';

const AddTaskModule = ({ addTaskModule }) => {
  let input, confirm;
  return (
    <footer className={`${classes.AddTaskModule}`}>
      <input
        autoFocus
        placeholder="Module name..."
        className={classes.AddTaskModule_input}
        ref={node => (input = node)}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            confirm.click();
          }
        }}
      />
      <button
        id="addTaskModule"
        ref={node => (confirm = node)}
        onClick={() => {
          addTaskModule(input.value);
          input.value = '';
        }}
        className={classes.AddTaskModule_btn}
      >
        + Add New Tasks Module
      </button>
    </footer>
  );
};

export default AddTaskModule;
