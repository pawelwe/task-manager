import React from 'react';
import classes from './Filter.css';

const PriorityFilter = ({ sortBy, moduleId, filter }) => {
  return (
    <button
      id="filter"
      onClick={() => {
        sortBy(moduleId);
      }}
      className={classes.Filter}
    >
      Sort by {filter}
    </button>
  );
};

export default PriorityFilter;
