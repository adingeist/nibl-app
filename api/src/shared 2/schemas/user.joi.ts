import { UserValidation } from '@shared/validation/user.validation';
import * as Yup from 'yup';

const getDate13YearsAgo = () => {
  const date = new Date();
  date.setUTCFullYear(new Date().getUTCFullYear() - 13);
  return date;
};

export const UserRolesStringArray = ['user', 'moderator', 'admin'];

export const userYupSchema = {
  email: Yup.string()
    .min(
      UserValidation.MIN_EMAIL_LENGTH,
      'Email must be at least ${min} characters'
    )
    .max(
      UserValidation.MAX_EMAIL_LENGTH,
      'Email must be ${max} characters or less'
    )
    .email('Must be a valid email'),
  phone: Yup.string()
    .min(
      UserValidation.MIN_PHONE_LENGTH,
      'Phone must be at least ${min} digits'
    )
    .max(UserValidation.MAX_PHONE_LENGTH, 'Phone must be ${max} digits or less')
    .matches(UserValidation.PHONE_REGEX, 'Phone must be valid'),
  birthday: Yup.date().max(
    getDate13YearsAgo(),
    'Must be at least 13 years old'
  ),
  bio: Yup.string().max(100),
  link: Yup.string()
    .matches(UserValidation.LINK_REGEX, 'Not a valid link')
    .max(500, 'Link is too long'),
  username: Yup.string()
    .min(
      UserValidation.MIN_USERNAME_LENGTH,
      'Username must be at least ${min} characters'
    )
    .max(
      UserValidation.MAX_USERNAME_LENGTH,
      'Username must be ${max} characters or less'
    )
    .matches(
      UserValidation.USERNAME_REGEX,
      `Username can only include letters, numbers, ".", and "_"`
    ),
  password: Yup.string()
    .min(
      UserValidation.MIN_PASSWORD_LENGTH,
      'Password must be at least ${min} characters'
    )
    .max(
      UserValidation.MAX_PASSWORD_LENGTH,
      'Password must be ${max} characters or less'
    )
    .matches(
      UserValidation.PASSWORD_REGEX,
      `Password must contain a number and a special character.`
    ),
  role: Yup.string().oneOf(UserRolesStringArray),
  isVerified: Yup.boolean(),
};
