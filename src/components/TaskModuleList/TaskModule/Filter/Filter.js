import React from 'react';
import classes from './Filter.css';

const Filter = ({ sortBy, moduleId, filter, text, sortTasksBy }) => {
  return (
    <button
      id="filter"
      onClick={() => {
        sortBy(moduleId, filter);
      }}
      className={`${classes.Filter} ${sortTasksBy === filter ? classes.isActive : ''}`}
    >
      {text}
    </button>
  );
};

export default Filter;
