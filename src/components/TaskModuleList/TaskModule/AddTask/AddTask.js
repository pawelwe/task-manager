import React, { Component } from 'react';
import classes from './AddTask.scss';
import Input from '../../../Inputs/Input';

class AddTask extends Component {
  state = {
    isValid: false,
    newTaskForm: {
      taskName: {
        elementType: 'text',
        config: {
          type: 'text',
          placeholder: 'Task name',
        },
        value: '',
        validation: {
          minLength: 3,
          maxLength: 15,
          required: true,
          error: 'Not valid name',
        },
        touched: false,
        valid: false,
      },
      priority: {
        elementType: 'number',
        config: {
          type: 'number',
          placeholder: 'Priority (1-10)',
        },
        value: '',
        validation: {
          required: true,
          error: 'Should be a number 1-10',
        },
        touched: false,
        valid: false,
      },
      expiration: {
        elementType: 'number',
        config: {
          type: 'number',
          placeholder: 'Expiration time (minutes)',
        },
        value: '',
        validation: {
          required: true,
          error: 'Should be a number',
        },
        touched: false,
        valid: false,
      },
    },
  };

  checkValidity(value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    return isValid;
  }

  handleInputChange = (e, inputId) => {
    const updatedForm = { ...this.state.newTaskForm };

    const updatedFormElement = {
      ...updatedForm[inputId],
    };

    updatedFormElement.value = e.target.value;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation,
    );
    updatedFormElement.touched = true;
    updatedForm[inputId] = updatedFormElement;

    // Check whole form
    let formIsValid = true;

    for (let inputId in updatedForm) {
      formIsValid = updatedForm[inputId].valid && formIsValid;
    }

    this.setState({
      newTaskForm: updatedForm,
      isValid: formIsValid,
    });
  };

  handleEnter = e => {
    if (e.key === 'Enter') {
      this.confirm.click();
    }
  };

  handleAddNewTask = e => {
    e.preventDefault();

    if (!this.state.isValid) {
      this.props.toggleAlert('addTaskInputAlert', true);
      return;
    }

    this.props.addNewTask(
      this.props.moduleId,
      this.state.newTaskForm.taskName.value,
      this.state.newTaskForm.priority.value,
      this.state.newTaskForm.expiration.value,
    );

    const formCopy = { ...this.state.newTaskForm };

    const clearedForm = Object.keys(formCopy)
      .map(input => {
        return {
          [input]: {
            ...formCopy[input],
            value: '',
            valid: false,
            touched: false,
          },
        };
      })
      .reduce((result, item) => {
        // Convert to Object
        let key = Object.keys(item)[0];
        result[key] = item[key];
        return result;
      }, {});

    this.setState({
      isValid: false,
      newTaskForm: clearedForm,
    });
  };

  renderAddTaskForm() {
    let newTaskForm = Object.keys(this.state.newTaskForm).map(inputKey => {
      return {
        id: inputKey,
        ...this.state.newTaskForm[inputKey],
      };
    });
    return (
      <form>
        {newTaskForm.map(formElement => (
          <Input
            key={formElement.id}
            className={classes.AddTask_input}
            elementType={formElement.elementType}
            value={formElement.value}
            config={formElement.config}
            valid={formElement.valid}
            shouldValidate={formElement.validation}
            touched={formElement.touched}
            // inputref={node => {
            //   this[formElement.id] = node;
            // }}
            onChange={e => {
              this.handleInputChange(e, formElement.id);
              this.handleEnter(e);
            }}
          />
        ))}
        <button
          id="addNewTask"
          // ref={node => (this.confirm = node)}
          onClick={this.handleAddNewTask}
          className={classes.AddTask_btn}
        >
          + Add New Task
        </button>
      </form>
    );
  }

  render() {
    return <div> {this.renderAddTaskForm()} </div>;
  }
}

export default AddTask;
