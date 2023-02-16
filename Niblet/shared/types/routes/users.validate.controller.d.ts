export type IGetIsUserValid = {
  body: Record<string, never>;
  query: {
    username: string | null;
    email: string | null;
    phone: string | null;
  };
  params: Record<string, never>;
};
