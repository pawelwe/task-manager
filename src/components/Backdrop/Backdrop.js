import React from 'react';
import classes from './Backdrop.scss';

const Backdrop = ({ transitionState, action }) => {
  const cssClasses = [
    classes.Backdrop,
    transitionState === 'entering' ? classes.isShown : null,
    transitionState === 'exiting' ? classes.isHidden : null,
  ];
  return (
    <div
      onClick={action ? action : null}
      className={cssClasses.join(' ')}
    />
  );
};

export default Backdrop;
