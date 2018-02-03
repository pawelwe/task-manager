import React from 'react';
import Wrapper from '../../hoc/Wrapper';
import classes from './Input.scss';

const Input = ({
  elementType,
  value,
  config,
  className,
  // inputref,
  valid,
  shouldValidate,
  touched,
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
          value={value}
          className={inputClasses.join(' ')}
          {...config}
          {...rest}
          // ref={inputref}
        />
      );
      break;
    case 'number':
      inputElement = (
        <input
          value={value}
          className={inputClasses.join(' ')}
          {...config}
          {...rest}
          // ref={inputref}
        />
      );
      break;
    case 'textarea':
      inputElement = (
        <textarea
          value={value}
          className={inputClasses.join(' ')}
          {...config}
          {...rest}
          // ref={inputref}
        />
      );
      break;
    default:
      inputElement = (
        <input
          value={value}
          className={inputClasses.join(' ')}
          {...config}
          {...rest}
          // ref={inputref}
        />
      );
  }

  return <Wrapper>{inputElement}</Wrapper>;
};

export default Input;
