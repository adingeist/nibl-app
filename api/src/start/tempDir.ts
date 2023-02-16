import fs from 'fs';

export default function tempDir() {
  if (process.env.NODE_PROCESS !== 'test') {
    if (!fs.existsSync('temp')) fs.mkdirSync('temp');
    if (!fs.existsSync('temp/uploads')) fs.mkdirSync('temp/uploads');
  }
}
