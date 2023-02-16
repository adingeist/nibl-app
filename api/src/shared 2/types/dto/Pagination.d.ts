export type PaginationRes = {
  page: number;
  perPage: number;
  pageCount: number;
  totalCount: number;
};

export type PaginationQuery = {
  page?: string;
  perPage?: string;
};
