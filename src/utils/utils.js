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

export const calculateExpiration = (creationDate, expirationPeriod) => {
  // Calculate diff in minutes
  let diff = (creationDate + Math.ceil(expirationPeriod * 60 * 1000)) - new Date().getTime();
  return Math.ceil(diff / 1000 / 60);
};
