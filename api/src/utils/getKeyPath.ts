export const getDotPathObject = (obj: Record<string, unknown>) => {
  const ret: Record<string, unknown> = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const path = (obj: any, currentPath = '') => {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        path(obj[key], currentPath ? `${currentPath}.${key}` : `${key}`);
      } else {
        ret[currentPath ? `${currentPath}.${key}` : `${key}`] = obj[key];
      }
    }
  };

  path(obj);

  return ret;
};
