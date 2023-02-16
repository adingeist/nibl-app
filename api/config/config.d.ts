export interface IConfig {
  gcp: {
    projectId: string;
    keyFile: string;
    bucket: string;
  };
  SMTPTransport: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  logger: {
    level: 'emerg' | 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug';
  };
  db: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: any;
    project: string;
    region: string;
    instance: string;
    username: string;
    password: string;
    database: string;
    host: string;
    ssl: {
      ca: string;
      cert: string;
      key: string;
    };
  };
  twilio: {
    accountSID: string;
    authToken: string;
    sender: string;
  };
  jwtPrivateKey: string;
  okImageTypes: string[];
  okVideoTypes: string[];
  videoTypeExt: {
    'video/mp4': '.mp4';
    'video/mpeg': '.mpeg';
    'video/x-m4v': '.m4v';
    'video/quicktime': '.mov';
    'video/h263': '.h263';
    'video/h264': '.h264';
  };
}
