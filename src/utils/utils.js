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

// Compare if array of objects is equal
export const isEqual = (value, other) => {
  // Get the value type
  var type = Object.prototype.toString.call(value);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false;

  // If items are not an object or array, return false
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

  // Compare the length of the length of the two items
  var valueLen =
    type === '[object Array]' ? value.length : Object.keys(value).length;
  var otherLen =
    type === '[object Array]' ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  // Compare two items
  var compare = function(item1, item2) {
    // Get the object type
    var itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false;
    } else {
      // Otherwise, do a simple comparison
      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) return false;
      } else {
        if (item1 !== item2) return false;
      }
    }
  };

  // Compare properties
  if (type === '[object Array]') {
    for (var i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }

  // If nothing failed, return true
  return true;
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

export const copyArray = (o) => {
  var output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
    v = o[key];
    output[key] = (typeof v === "object") ? copyArray(v) : v;
  }
  return output;
};
