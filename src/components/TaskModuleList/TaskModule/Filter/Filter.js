import React from 'react';
import classes from './Filter.scss';

const Filter = ({ sortBy, moduleId, filter, text, tasksSortedBy }) => {
  return (
    <button
      id='filter'
      onClick={() => {
        sortBy(moduleId, filter);
      }}
      className={`${classes.Filter} ${tasksSortedBy === filter ? classes.isActive : ''}`}
    >
      {text}
    </button>
  );
};

export default Filter;
