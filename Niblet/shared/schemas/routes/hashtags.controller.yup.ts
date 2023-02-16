import * as Yup from 'yup';

export const hashtagRouteSchemas = {
  getHashtags: { query: { name: Yup.string().required() } },
};
