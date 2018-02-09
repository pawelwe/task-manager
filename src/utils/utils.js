export const findModuleToUpdateIndex = (modules, moduleId) => {
  return modules.findIndex(module => {
    return module.id === moduleId;
  });
};

export const sortBy = (key, asc) => {
  return (a, b) => {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }
    let sortDir = asc ? 'asc' : 'desc';
    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }

    return sortDir === 'desc' ? comparison : comparison * -1;
  };
};

export const calculateExpiration = (
  creationDate,
  expirationPeriod,
  timeFrame = 'minutes',
) => {
  switch (timeFrame.toLowerCase()) {
    case 'seconds': {
      let diff1 =
        creationDate +
        Math.ceil(expirationPeriod * 1000) -
        new Date().getTime();
      return {
        value: Math.ceil(diff1 / 1000),
        unifiedValue: creationDate + Math.ceil(expirationPeriod * 1000),
      };
    }
    case 'minutes': {
      let diff2 =
        creationDate +
        Math.ceil(expirationPeriod * 60 * 1000) -
        new Date().getTime();
      return {
        value: Math.ceil(diff2 / 1000 / 60),
        unifiedValue: creationDate + Math.ceil(expirationPeriod * 60 * 1000),
      };
    }
    case 'hours': {
      let diff2 =
        creationDate +
        Math.ceil(expirationPeriod * 60 * 60 * 1000) -
        new Date().getTime();

      return {
        value: Math.ceil(diff2 / 1000 / 60 / 60),
        unifiedValue:
          creationDate + Math.ceil(expirationPeriod * 60 * 60 * 1000),
      };
    }
    case 'days': {
      let diff3 =
        creationDate +
        Math.ceil(expirationPeriod * 60 * 60 * 24 * 1000) -
        new Date().getTime();

      return {
        value: Math.ceil(diff3 / 1000 / 60 / 60 / 24),
        unifiedValue:
          creationDate + Math.ceil(expirationPeriod * 60 * 60 * 24 * 1000),
      };
    }
    default:
      // Minutes
      let diff4 =
        creationDate +
        Math.ceil(expirationPeriod * 60 * 60 * 1000) -
        new Date().getTime();

      return {
        value: Math.ceil(diff4 / 1000 / 60 / 60),
        unifiedValue: creationDate + Math.ceil(expirationPeriod * 60 * 1000),
      };
  }
};

// Calculate alert timeout in minutes
export const calculateAlert = (exp, timeSpan, timeout) => {
  switch (timeSpan) {
    case 'seconds': {
      return exp < timeout * 60;
    }
    case 'minutes': {
      return exp < timeout;
    }
    case 'hours': {
      return exp < timeout / 60;
    }
    case 'days': {
      return exp < timeout / 60 / 24 / 31;
    }
    default:
      return false;
  }
};

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
