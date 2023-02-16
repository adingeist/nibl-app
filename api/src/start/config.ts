import config from 'config';
import rootDir from 'app-root-path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CustomEnvVarsJSON = require(`${rootDir}/config/custom-environment-variables.json`);

const getCustomEnvList = (
  obj: Record<string, object | string | number>
) => {
  const envVars: Record<string, object | string | number> = {};

  const getVarPathInObj = (
    obj: Record<string, object | string | number>,
    path = ''
  ) => {
    const keys = Object.keys(obj);

    for (const key of keys) {
      const thisPath = `${path}${path.length === 0 ? '' : '.'}${key}`;
      if (
        typeof obj[key] === 'string' ||
        typeof obj[key] === 'number'
      ) {
        envVars[thisPath] = obj[key];
      } else {
        getVarPathInObj(
          obj[key] as Record<string, object | string | number>,
          thisPath
        );
      }
    }
  };

  getVarPathInObj(obj);
  return envVars;
};

export const startConfig = () => {
  let undefinedVars = '';

  const configProperties = getCustomEnvList(CustomEnvVarsJSON);

  for (const [k, v] of Object.entries(configProperties)) {
    try {
      if (!config.get(k)) undefinedVars = `${undefinedVars}\n${v}`;
    } catch (err) {
      undefinedVars = `${undefinedVars}\n${v}`;
    }
  }

  if (undefinedVars)
    throw new Error(
      `FATAL ERROR: The following environment variables are undefined:${undefinedVars}`
    );
};
