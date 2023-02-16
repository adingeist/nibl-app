export const floatOrUndef = (str: string | undefined) =>
  str ? Number.parseFloat(str) : undefined;
