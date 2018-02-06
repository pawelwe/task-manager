import React, { PureComponent } from 'react';
import classes from './AddTaskModule.scss';
import Input from '../Inputs/Input';

class AddTaskModule extends PureComponent {
  state = {
    isValid: false,
    newTaskModuleForm: {
      taskModuleName: {
        elementType: 'text',
        config: {
          type: 'text',
          placeholder: 'Task module name',
        },
        value: '',
        validation: {
          minLength: 3,
          maxLength: 25,
          required: true,
          errorMessage: 'Not valid name',
        },
        touched: false,
        valid: false,
      },
    },
  };

  componentDidUpdate() {
    console.info('Add Task Module component updated!');
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

  handleEnter = e => {
    if (e.key === 'Enter') {
      this.confirm.click();
    }
  };

  handleAddNewTaskModule = e => {
    e.preventDefault();

    if (!this.state.isValid) {
      this.props.toggleAlert('addModuleInputAlert', true);
      return;
    }

    this.props.addTaskModule(this.state.newTaskModuleForm.taskModuleName.value);

    const formCopy = { ...this.state.newTaskModuleForm };

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
      newTaskModuleForm: clearedForm,
    });
  };

  handleInputChange = (e, inputId) => {
    const updatedForm = { ...this.state.newTaskModuleForm };

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
      newTaskModuleForm: updatedForm,
      isValid: formIsValid,
    });
  };

  renderAddTaskModuleForm() {
    let newTaskFormModule = Object.keys(
      this.state.newTaskModuleForm,
    ).map(inputKey => {
      return {
        id: inputKey,
        ...this.state.newTaskModuleForm[inputKey],
      };
    });
    return (
      <form className={`${classes.AddTaskModule}`}>
        {newTaskFormModule.map(formElement => (
          <Input
            key={formElement.id}
            className={classes.AddTaskModule_input}
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
          {newTaskFormModule.map(formElement => {
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
        <button
          id="addTaskModule"
          onClick={this.handleAddNewTaskModule}
          className={classes.AddTaskModule_btn}
        >
          + Add New Tasks Module
        </button>
      </form>
    );
  }

  render() {
    return <footer>{this.renderAddTaskModuleForm()}</footer>;
  }
}

export default AddTaskModule;
