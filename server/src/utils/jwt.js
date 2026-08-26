import jwt from "jsonwebtoken";

import env from "../config/env.js";
import { AUTH } from "../constants/auth.constants.js";
import { TOKEN_TYPE } from "../constants/jwt.constants.js";

const config = {
  [TOKEN_TYPE.ACCESS]: {
    secret: env.JWT_ACCESS_SECRET,
    expiresIn: AUTH.ACCESS_TOKEN_EXPIRES_IN,
  },

  [TOKEN_TYPE.REFRESH]: {
    secret: env.JWT_REFRESH_SECRET,
    expiresIn: AUTH.REFRESH_TOKEN_EXPIRES_IN,
  },
};

const createToken = (payload, type) => {
  return jwt.sign(payload, config[type].secret, {
    expiresIn: config[type].expiresIn,
  });
};

const verifyToken = (token, type) => {
  return jwt.verify(token, config[type].secret);
};

export const generateAccessToken = (payload) =>
  createToken(payload, TOKEN_TYPE.ACCESS);

export const generateRefreshToken = (payload) =>
  createToken(payload, TOKEN_TYPE.REFRESH);

export const verifyAccessToken = (token) =>
  verifyToken(token, TOKEN_TYPE.ACCESS);

export const verifyRefreshToken = (token) =>
  verifyToken(token, TOKEN_TYPE.REFRESH);