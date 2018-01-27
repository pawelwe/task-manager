import React from 'react';
import classes from './Alert.scss';

const Alert = ({ show, children, action, id }) => {
  return (
    <div
      className={classes.Alert}
      style={{
        left: show ? '30px' : '-320px',
        opacity: show ? '1' : '0.2',
      }}
    >
      <span
        className={classes.Alert_removeBtn}
        onClick={() => {
          action(id, false);
        }}
      />
      {children}
    </div>
  );
};

export default Alert;
