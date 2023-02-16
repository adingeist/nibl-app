type IdArray = { id: string }[];

export const findIndexOfId = (arr: IdArray, id: string) =>
  arr.findIndex((obj) => obj.id === id);
