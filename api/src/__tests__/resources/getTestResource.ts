import fs from 'fs/promises';

export const getTestResource = (filename: string) =>
  fs.readFile(`${__dirname}/${filename}`);
