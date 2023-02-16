import bcrypt from 'bcrypt';

export const hash = async (field: string) => {
  /* istanbul ignore next */
  const salt = await bcrypt.genSalt(process.env.NODE_ENV === 'test' ? 1 : 10);
  return bcrypt.hash(field, salt);
};
