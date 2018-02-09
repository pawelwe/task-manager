import React from 'react';
import clockIcon from '../../../../../images/clock-icon.svg';
import {
  calculateExpiration,
  calculateAlert,
  months,
} from '../../../../../utils/utils';
import classes from './Task.scss';

const Task = ({
  name,
  completed,
  toggleTask,
  moduleId,
  id,
  priority,
  creationDate,
  expirationPeriod,
  timeFrame,
  removeTask,
  toggleTaskEditMode,
  editMode,
}) => {
  const expiration = calculateExpiration(
    creationDate,
    expirationPeriod,
    timeFrame,
  ).value;
  const expirationAlertMinutesTimeout = 30;
  const timeToTurnOnAlert = calculateAlert(
    expiration,
    timeFrame,
    expirationAlertMinutesTimeout,
  );

  const getCreationDate = new Date(creationDate);
  const year = getCreationDate.getFullYear();
  const month = months[getCreationDate.getMonth()];
  const date = getCreationDate.getDate();
  const hour = getCreationDate.getHours();
  const min = getCreationDate.getMinutes();

  return (
    <li className={classes.TaskItemList_item}>
      <div className={classes.TaskItemList_item_toolbar}>
        {!editMode && (
          <span
            onClick={() => toggleTaskEditMode(moduleId, id, true)}
            data-title="Edit task"
            className={`${classes.editIcon} tooltip`}
          >
            ✏
          </span>
        )}

        {editMode && (
          <span
            className={`${classes.TaskItemList_item_editMode} tooltip`}
            data-title="Task in edit mode"
          >
            ♺
          </span>
        )}

        {!editMode && (
          <span
            id="removeTask"
            data-title="Remove task"
            onClick={() => {
              toggleTaskEditMode(moduleId, id, false);
              removeTask(moduleId, id);
            }}
            className={`${classes.TaskItemList_item_removeBtn} tooltip`}
          >
            ✗
          </span>
        )}
      </div>
      <section
        id="toggleTask"
        className={`${classes.TaskItemList_item_content} tooltip`}
        onClick={() => toggleTask(moduleId, id)}
        style={{ textDecoration: completed ? 'line-through' : '' }}
        data-title="Click to toggle completion..."
      >
        <h5 className={classes.TaskItemList_item_header}>{name}</h5>
        <p className={classes.TaskItemList_item_info}>
          <strong>Created:</strong>{' '}
          {`${date} ${month} ${year} / ${hour}:${min}`}
        </p>
        <p className={classes.TaskItemList_item_info}>
          <strong>Priority:</strong> {priority}
        </p>
        <p className={classes.TaskItemList_item_info}>
          <span className={timeToTurnOnAlert ? 'isExpiring' : ''}>
            {!timeToTurnOnAlert &&
              expiration > 0 && (
                <span>
                  <strong>Expires in:</strong> {expiration} {timeFrame}
                </span>
              )}
            {timeToTurnOnAlert &&
              expiration > 0 && (
                <span>
                  <img
                    className="expirationIcon"
                    src={clockIcon}
                    alt="expiration-icon"
                  />
                  Expires in: {expiration} {timeFrame}
                </span>
              )}
            {expiration <= 0 && (
              <span>
                <img
                  className="expirationIcon"
                  src={clockIcon}
                  alt="expiration-icon"
                />
                <strong>Expired!</strong>
              </span>
            )}
          </span>
        </p>
      </section>
    </li>
  );
};

export default Task;
