export interface IGetAuthEmail {
  body: Record<string, never>;
  query: Record<string, never>;
  params: { id: string };
}

export interface IGetAuthPhone {
  body: Record<string, never>;
  res: { message: string };
  query: Record<string, never>;
  params: { id: string };
}

export interface IPostAuthFromEmail {
  body: Record<string, never>;
  query: Record<string, never>;
  params: { id: string; pin: string };
}

export interface IPostAuthFromPhone {
  params: { id: string; pin: string };
  res: { message: string };
  body: Record<string, never>;
  query: Record<string, never>;
}
