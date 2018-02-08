import React, { Component } from 'react';
import classes from './AddTask.scss';
import Input from '../../../Inputs/Input';
import isEqual from 'lodash.isequal';

class AddTask extends Component {
  state = {
    editMode: false,
    formIsValid: false,
    editedTaskId: null,
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
          errorMessage: 'Not valid name',
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
          errorMessage: 'Should be a number 1-10',
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
          errorMessage: 'Should be a number',
        },
        touched: false,
        valid: false,
      },
    },
  };

  checkIfEditMode() {
    let editMode = false;
    let updatedForm, editedTaskId;

    this.props.tasks.forEach(formElement => {
      if (formElement.editMode && formElement.editMode === true) {
        editMode = true;
      }
    });

    if (editMode) {
      this.props.tasks.forEach(task => {
        if (task.editMode === true) {
          updatedForm = {
            ...this.state.newTaskForm,
            taskName: {
              ...this.state.newTaskForm.taskName,
              value: task.name,
            },
            priority: {
              ...this.state.newTaskForm.priority,
              value: task.priority,
            },
            expiration: {
              ...this.state.newTaskForm.expiration,
              value: task.expirationPeriod,
            },
          };
          editedTaskId = task.id;
        }
      });

      this.setState({
        editMode: true,
        newTaskForm: updatedForm,
        editedTaskId: editedTaskId,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.tasks, this.props.tasks)) {
      this.checkIfEditMode();
    }
    console.info('Add task did update');
  }

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
      formIsValid: formIsValid,
    });
  };

  handleEnter = e => {
    if (e.key === 'Enter') {
      this.confirm.click();
    }
  };

  handleClearForm = form => {
    return Object.keys(form)
      .map(input => {
        return {
          [input]: {
            ...form[input],
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
  };

  handleAddNewTask = e => {
    e.preventDefault();

    if (!this.state.formIsValid) {
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

    this.setState({
      formIsValid: false,
      newTaskForm: this.handleClearForm(formCopy),
    });
  };

  handleSaveEditedTask = e => {
    e.preventDefault();
    console.info('Saving edited task...');

    const formCopy = { ...this.state.newTaskForm };

    this.props.toggleTaskEditMode(
      this.props.moduleId,
      this.state.editedTaskId,
      false,
    );

    this.props.editTask(
      this.props.moduleId,
      this.state.editedTaskId,
      this.state.newTaskForm.taskName.value,
      this.state.newTaskForm.priority.value,
      this.state.newTaskForm.expiration.value,
    );
    this.setState({
      editMode: false,
      editedTaskId: null,
      newTaskForm: this.handleClearForm(formCopy),
    });
  };

  handleExitEditMode = e => {
    console.log('Exit edit mode...');
    e.preventDefault();
    const formCopy = { ...this.state.newTaskForm };

    this.props.toggleTaskEditMode(
      this.props.moduleId,
      this.state.editedTaskId,
      false,
    );

    this.setState({
      editMode: false,
      editedTaskId: null,
      newTaskForm: this.handleClearForm(formCopy),
    });
  };

  renderAddTaskForm() {
    let newTaskForm = Object.keys(this.state.newTaskForm).map(inputKey => {
      return {
        id: inputKey,
        ...this.state.newTaskForm[inputKey],
      };
    });

    const renderConfirmButton = () => {
      if (!this.state.editMode) {
        return (
          <button
            id="addNewTask"
            // ref={node => (this.confirm = node)}
            onClick={this.handleAddNewTask}
            className={classes.AddTask_btn}
          >
            + Add New Task
          </button>
        );
      } else {
        return (
          <div>
            <button
              id="addNewTask"
              onClick={this.handleSaveEditedTask}
              className={classes.AddTask_btn}
            >
              Save Task
            </button>
            <button
              id="addNewTask"
              onClick={this.handleExitEditMode}
              className={classes.AddTask_btn}
            >
              Cancel
            </button>
          </div>
        );
      }
    };

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
            onChange={e => {
              this.handleInputChange(e, formElement.id);
              this.handleEnter(e);
            }}
          />
        ))}
        <ul className={classes.errorMessages}>
          {newTaskForm.map(formElement => {
            return (
              <li className={classes.errorMessages_item} key={formElement.id}>
                {!formElement.valid &&
                  formElement.touched && (
                    <p>☹ {formElement.validation.errorMessage}</p>
                  )}
              </li>
            );
          })}
        </ul>
        {renderConfirmButton()}
      </form>
    );
  }

  render() {
    return <div> {this.renderAddTaskForm()} </div>;
  }
}

export default AddTask;
