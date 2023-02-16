import dotenv from 'dotenv';
import fs from 'fs';
import rootDir from 'app-root-path';

export default () => {
  // Load environment variables from .env files
  const systemPath = '/etc/secrets/.credentials.env';
  const projectPath = `${rootDir}/config/.credentials.env`;
  if (fs.existsSync(systemPath)) {
    dotenv.config({ path: systemPath });
  } else if (fs.existsSync(projectPath)) {
    dotenv.config({ path: projectPath });
  }
};
