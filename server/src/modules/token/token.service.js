import prisma from "../../lib/prisma.js";

import tokenRepository from "./token.repository.js";

import {
  generateToken,
  hashToken,
  getTokenExpiry,
} from "./token.utils.js";

import { TOKEN_EXPIRY } from "./token.constants.js";

class TokenService {
  async create({ userId, type }) {
    return prisma.$transaction(async (tx) => {
      await tokenRepository.deleteByUserAndType(
        userId,
        type,
        tx
      );

      const rawToken = generateToken();

      const tokenHash = hashToken(rawToken);

      const expiresAt = getTokenExpiry(
        type,
        TOKEN_EXPIRY
      );

      await tokenRepository.create(
        {
          tokenHash,
          type,
          expiresAt,
          userId,
        },
        tx
      );

      return rawToken;
    });
  }

  async findValidToken({ token, type }) {
    const tokenHash = hashToken(token);

    return tokenRepository.findValidToken(
      tokenHash,
      type
    );
  }

  async consume({ token, type }) {
    return prisma.$transaction(async (tx) => {
      const tokenHash = hashToken(token);

      const tokenRecord =
        await tokenRepository.findValidToken(
          tokenHash,
          type,
          tx
        );

      if (!tokenRecord) {
        return null;
      }

      const deleted = await tokenRepository.deleteById(
        tokenRecord.id,
        tx
      );

      if (deleted.count == 0) {
        return null;
      }

      return tokenRecord;
    });
  }

  async deleteExpired() {
    return tokenRepository.deleteExpired();
  }
}

export default TokenService;