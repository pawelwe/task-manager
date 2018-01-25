import React from 'react';
import clockIcon from '../../../../../images/clock-icon.svg';
import { calculateExpiration } from '../../../../../utils/utils';
import classes from './Task.css';

const Task = ({
  name,
  completed,
  toggleTask,
  moduleId,
  id,
  priority,
  creationDate,
  expirationPeriod,
  removeTask,
}) => {
  const expiration = calculateExpiration(creationDate, expirationPeriod);
  return (
    <li
      className={`${classes.TaskItemList_item} fadeIn`}
      style={{ textDecoration: completed ? 'line-through' : '' }}
    >
      <span
        id="removeTask"
        onClick={() => removeTask(moduleId, id)}
        className={`removeBtn removeBtn__small`}
      />
      <section id="toggleTask" onClick={() => toggleTask(moduleId, id)}>
        <h5 className={classes.TaskItemList_item_header}>{name}</h5>
        <p className={classes.TaskItemList_item_info}>Priority: {priority}</p>
        <p className={classes.TaskItemList_item_info}>
          <span className={expiration < 31 ? 'isExpiring' : ''}>
            {expiration >= 31 && <span>Expires in: {expiration} minutes</span>}
            {expiration < 31 &&
              expiration > 0 && (
                <span>
                  <img
                    className='expirationIcon'
                    src={clockIcon}
                    alt="expiration-icon"
                  />
                  Expires in: {expiration} minutes
                </span>
              )}
            {expiration <= 0 && (
              <span>
                <img
                  className='expirationIcon'
                  src={clockIcon}
                  alt="expiration-icon"
                />
                Expired!
              </span>
            )}
          </span>
        </p>
      </section>
    </li>
  );
};

export default Task;
