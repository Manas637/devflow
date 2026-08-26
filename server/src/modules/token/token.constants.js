import {TokenType} from "@prisma/client";

export const TOKEN_EXPIRY = {
  [TokenType.EMAIL_VERIFICATION]: 24 * 60 * 60 * 1000, // 24 hours

  [TokenType.PASSWORD_RESET]: 30 * 60 * 1000, // 30 minutes
};