export const PASSWORD_ERROR = [
  {
    msg: 'Use 8 or more characters.',
    regex: '^.{8,}$',
    error: false,
  },
  {
    msg: 'Use upper and lower case letters. (e.g. Aa)',
    regex: '^(?=.*[a-z])(?=.*[A-Z])',
    error: false,
  },
  {
    msg: 'Use a number. (e.g. 1234)',
    regex: '.*[0-9].*',
    error: false,
  },
  {
    msg: 'Use a symbol. (e.g. !@#$)',
    regex: '.*[!@#$%^&*].*',
    error: false,
  },
];
