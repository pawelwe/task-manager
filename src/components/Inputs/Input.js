import React from 'react';
import Wrapper from '../../hoc/Wrapper';
import classes from './Input.scss';

const Input = ({
  elementType,
  value,
  config,
  className,
  inputref,
  valid,
  shouldValidate,
  touched,
  options,
  width,
  ...rest
}) => {
  let inputElement = null;
  const inputClasses = [className];
  !valid && shouldValidate && touched
    ? inputClasses.push(classes.isInvalid)
    : inputClasses.push(classes.isValid);

  switch (elementType) {
    case 'text':
      inputElement = (
        <input
          type="text"
          style={{ width: `${width}%` }}
          value={value}
          className={inputClasses.join(' ')}
          {...config}
          {...rest}
          ref={inputref}
        />
      );
      break;
    case 'number':
      inputElement = (
        <input
          type="number"
          style={{ width: `${width}%` }}
          value={value}
          className={inputClasses.join(' ')}
          {...config}
          {...rest}
          ref={inputref}
        />
      );
      break;
    case 'textarea':
      inputElement = (
        <textarea
          value={value}
          style={{ width: `${width}%` }}
          className={inputClasses.join(' ')}
          {...config}
          {...rest}
          ref={inputref}
        />
      );
      break;
    case 'select':
      inputElement = (
        <select
          value={value}
          style={{ width: `${width}%` }}
          className={inputClasses.join(' ')}
          {...config}
          {...rest}
          ref={inputref}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.display}
            </option>
          ))}
        </select>
      );
      break;
    default:
      inputElement = (
        <input
          value={value}
          className={inputClasses.join(' ')}
          {...config}
          {...rest}
          ref={inputref}
        />
      );
  }

  return <Wrapper>{inputElement}</Wrapper>;
};

export default Input;
