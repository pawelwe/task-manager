import React, { PureComponent } from 'react';
import classes from './AddTaskModule.scss';

class AddTaskModule extends PureComponent {
  state = {
    validation: {
      moduleName: {
        error: false,
        msg: 'Not valid name',
      },
    },
  };

  componentDidUpdate() {
    console.info('Add Task Module component updated!');
  }

  render() {
    let { addTaskModule } = this.props;
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
  }
}

export default AddTaskModule;
