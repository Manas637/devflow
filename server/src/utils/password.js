import bcrypt from "bcrypt";

const BCRYPT_COST_FACTOR = 12;

export const hashPassword = async (password) => {
  return bcrypt.hash(password, BCRYPT_COST_FACTOR);
};

export const comparePassword = async (
  password,
  hashedPassword
) => {
  return bcrypt.compare(password, hashedPassword);
};