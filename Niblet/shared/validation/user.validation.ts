export const UserValidation = {
  // prettier-ignore
  USERNAME_REGEX: new RegExp('^'+
  '(?!^\\.)'+ // can't start with period
  '(?!.*\\.$)'+ // can't end with period
  '(?!.*\\.{2,}.*)'+ // can't have two or more periods in a row
  '(?=^.*[^._].*$)'+ // must contain a character other than _ and .
  '(?=^.*\\D.*$)' + // can't contain only digits
  '[a-zA-Z0-9._]*$' // can only contain alpha-numerics . and _
  ),

  // prettier-ignore
  PASSWORD_REGEX: new RegExp('^'+
  '(?=.*[0-9])'+ // must contain a number
  '(?=.*[^A-Za-z0-9])'+ // must contain a special character
  '.*$'
  ),

  LINK_REGEX:
    // eslint-disable-next-line no-useless-escape
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,

  PHONE_REGEX: /^\d+$/,

  MAX_EMAIL_LENGTH: 320,
  MAX_NAME_LENGTH: 30,
  MAX_PASSWORD_LENGTH: 24,
  MAX_PHONE_LENGTH: 15,
  MAX_USERNAME_LENGTH: 30,
  MIN_EMAIL_LENGTH: 1,
  MIN_NAME_LENGTH: 1,
  MIN_PASSWORD_LENGTH: 7,
  MIN_PHONE_LENGTH: 4,
  MIN_USERNAME_LENGTH: 2,
};
