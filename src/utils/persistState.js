import throttle from 'lodash.throttle';

const handleSavingToStorage = (modules) => {
  try {
    const taskManagerApp = JSON.stringify(
      Object.assign({}, { taskModules: modules }),
    );
    localStorage.setItem('taskManagerApp', taskManagerApp);
    console.info('Task Manager App State saved...');
    return taskManagerApp;
  } catch (err) {
    console.warn(err);
  }
};

export const handleSaveState = (modules) => {
  const throttledHandleSavingToStorage = throttle(
    () => handleSavingToStorage(modules),
    1000,
  );
  return throttledHandleSavingToStorage();
};

export const handleLoadState = () => {
  try {
    const taskManagerApp = JSON.parse(localStorage.getItem('taskManagerApp'));
    if (taskManagerApp === null) {
      return undefined;
    }
    console.info('Task Manager App State loaded...');
    return taskManagerApp;
  } catch (err) {
    return undefined;
  }
};