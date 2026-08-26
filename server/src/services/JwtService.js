import crypto from "node:crypto";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

class JwtService {
  generateAccessToken(payload) {
    return generateAccessToken(payload);
  }

  generateRefreshToken(payload) {
    return generateRefreshToken(payload);
  }

  verifyAccessToken(token) {
    try {
      return verifyAccessToken(token);
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token) {
    try {
      return verifyRefreshToken(token);
    } catch {
      return null;
    }
  }

  hashRefreshToken(token) {
    return crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    }
    
  compareRefreshToken(token, hashedToken) {
    return this.hashRefreshToken(token) === hashedToken;
  }

}

export default JwtService;