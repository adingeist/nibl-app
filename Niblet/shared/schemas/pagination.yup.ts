import * as Yup from 'yup';

export const yupPaginationQuery = {
  page: Yup.number().min(0),
  perPage: Yup.number().positive(),
};
