import React from 'react';
import clockIcon from '../../../../../images/clock-icon.svg';
import eyeIcon from '../../../../../images/view-icon.svg';
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
  const expirationEpoch = calculateExpiration(
    creationDate,
    expirationPeriod,
    timeFrame,
  ).unifiedValue;
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

  const getExpirationDate = new Date(expirationEpoch);
  const expirationYear = getExpirationDate.getFullYear();
  const expirationMonth = months[getExpirationDate.getMonth()];
  const expirationDate = getExpirationDate.getDate();
  const expirationHour = getExpirationDate.getHours();
  const expirationMin = getExpirationDate.getMinutes();

  return (
    <li
      className={[
        classes.TaskItemList_item,
        editMode ? classes.TaskItemList_item__edited : null,
      ].join(' ')}
    >
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
            <img src={eyeIcon} alt="eye icon" />
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
          <strong>Priority:</strong> {priority}
        </p>
        <p className={classes.TaskItemList_item_info}>
          <strong>Created:</strong>{' '}
          {`${date} ${month} ${year} / ${hour}:${min}`}
        </p>
        <p className={classes.TaskItemList_item_info}>
          <span className={timeToTurnOnAlert ? 'isExpiring' : ''}>
            {!timeToTurnOnAlert &&
              expiration > 0 && (
                <span>
                  <strong>Expiration:</strong>
                  <span>
                    {' '}
                    {`${expirationDate} ${expirationMonth} ${expirationYear} / ${expirationHour}:${expirationMin}`}
                  </span>
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
                  Expiration: {expiration} {timeFrame}
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
