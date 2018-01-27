import React from 'react';
import classes from './Backdrop.scss';

const Backdrop = ({show, action}) => (
  <div
    onClick={action ? action : null}
    className={classes.Backdrop}
    style={{
      opacity: show ? '1' : '0',
      zIndex: show ? '99' : '-1',
    }}
  />
);

export default Backdrop;
