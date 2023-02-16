export interface IAuth {
  params: never;
  res: { success: true };
  body: {
    username?: string;
    email?: string;
    phone?: string;
    password: string;
  };
  query: never;
}

export interface IAuthOTP {
  params: never;
  res: { success: true };
  body: {
    userId: string;
    pin: string;
  };
  query: never;
}

export interface IAuthOTPRequest {
  params: never;
  res: { userId: string };
  body: {
    email?: string;
    phone?: string;
  };
  query: never;
}

export interface ILogout {
  params: Record<string, never>;
  res: Record<string, never>;
  body: { pushToken: string };
  query: Record<string, never>;
}
