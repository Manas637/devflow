import prisma from "../../lib/prisma.js";

import {
  userSelect,
  userWithPasswordSelect,
  sessionSelect,
  userSessionSelect,
} from "../../lib/prisma/selects.js";

/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
*/

export const findUserByEmail = async (email, db = prisma) => {
  return db.user.findUnique({
    where: {
      email,
    },
    select: userWithPasswordSelect,
  });
};

export const findUserByEmailWithoutPassword = async (
  email,
  db = prisma
) => {
  return db.user.findUnique({
    where: {
      email,
    },
    select: userSelect,
  });
};

export const findUserById = async (userId, db = prisma) => {
  return db.user.findUnique({
    where: {
      id: userId,
    },
    select: userSelect,
  });
};

export const createUser = async (userData, db = prisma) => {
  return db.user.create({
    data: userData,
    select: userSelect,
  });
};

/*
|--------------------------------------------------------------------------
| Session
|--------------------------------------------------------------------------
*/

export const createSession = async (sessionData, db = prisma) => {
  return db.session.create({
    data: sessionData,
    select: sessionSelect,
  });
};

export const findSessionById = async (sessionId, db = prisma) => {
  return db.session.findUnique({
    where: {
      id: sessionId,
    },
    select: sessionSelect,
  });
};

export const deleteSession = async (sessionId, db = prisma) => {
  return db.session.delete({
    where: {
      id: sessionId,
    },
  });
};

export const deleteAllSessions = async (userId, db = prisma) => {
  return db.session.deleteMany({
    where: {
      userId,
    },
  });
};

export const deleteAllSessionsExcept = async (
  userId,
  sessionId,
  db = prisma
) => {
  return db.session.deleteMany({
    where: {
      userId,
      NOT: {
        id: sessionId,
      },
    },
  });
};

export const updateSession = async (
  sessionId,
  sessionData,
  db = prisma
) => {
  return db.session.update({
    where: {
      id: sessionId,
    },
    data: sessionData,
    select: sessionSelect,
  });
};

export const updateSessionLastUsed = async (
  sessionId,
  db = prisma
) => {
  return db.session.update({
    where: {
      id: sessionId,
    },
    data: {
      lastUsedAt: new Date(),
    },
  });
};

export const updateUserById = async (
  userId,
  userData,
  db = prisma
) => {
  return db.user.update({
    where: {
      id: userId,
    },
    data: userData,
    select: userSelect,
  });
};

export const findSessionsByUserId = async (
  userId,
  db = prisma
) => {
  return db.session.findMany({
    where: {
      userId,
    },
    select: userSessionSelect,
    orderBy: {
      lastUsedAt: "desc",
    },
  });
};

export const deleteSessionById = async (
  userId,
  sessionId,
  db = prisma
) => {
  return db.session.deleteMany({
    where: {
      id: sessionId,
      userId,
    },
  });
};

const authRepository = {
  findUserByEmail,
  findUserByEmailWithoutPassword,
  findUserById,
  createUser,
  createSession,
  findSessionById,
  updateSession,
  updateSessionLastUsed,
  deleteSession,
  deleteAllSessions,
  deleteAllSessionsExcept,
  updateUserById,
  findSessionById,
  deleteSessionById,
  findSessionsByUserId,
  deleteSessionById,
};

export default authRepository;