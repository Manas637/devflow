import prisma from "../../lib/prisma.js";

class TokenRepository {
  async create(data,db = prisma) {
    return db.token.create({
      data,
    });
  }

  async findValidToken(tokenHash, type, db = prisma) {
    return db.token.findFirst({
        where: {
            tokenHash,
            type,
            expiresAt: {
                gt: new Date(),
            },
        },
        include: {
            user: true,
        },
    });
  }

  async findByUserAndType(userId, type, db = prisma) {
    return db.token.findUnique({
      where: {
        userId_type: {
          userId,
          type,
        },
      },
    });
  }

  async deleteById(id, db = prisma) {
    return db.token.deleteMany({
      where: {
        id,
      },
    });
  }

  async deleteByUserAndType(userId, type, db = prisma) {
    return db.token.deleteMany({
      where: {
        userId,
        type,
      },
    });
  }

  async deleteExpired(db = prisma) {
    return db.token.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}

export default new TokenRepository();