import { YupErrors } from '@shared/schemas/yupErrors';
import * as Yup from 'yup';

const HASHTAG_REGEX = /^[a-zA-Z0-9]*$/;
const HASHTAG_BLACKLIST: string[] = [];

export const postYupSchema = {
  caption: Yup.string()
    .min(0, YupErrors.number.min('Caption'))
    .max(300, YupErrors.number.max('Caption')),

  hashtags: Yup.array()
    .of(
      Yup.string()
        .min(1, YupErrors.string.min('Hashtag'))
        .max(2000, YupErrors.string.max('Hashtag'))
        .matches(HASHTAG_REGEX, 'Hashtag can only contain alphanumerics')
        .notOneOf(HASHTAG_BLACKLIST)
    )
    .min(0)
    .max(20),
};
