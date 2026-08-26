import prisma from "../../lib/prisma.js";

import {
  publicUserSelect,
  userSelect,
  userWithPasswordSelect,
} from "../../lib/prisma/selects.js";

export const findUserById = async (
  id,
  db = prisma
) => {
  return db.user.findUnique({
    where: {
      id,
    },
    select: userSelect,
  });
};

export const updateUser = async (
  id,
  data,
  db = prisma
) => {
  return db.user.update({
    where: {
      id,
    },
    data,
    select: userSelect,
  });
};

export const findPublicUserById = async (
  id,
  db = prisma
) => {
  return db.user.findUnique({
    where: {
      id,
    },
    select: publicUserSelect,
  });
};

export const findUserForPasswordChange = async (
  id,
  db = prisma
) => {
  return db.user.findUnique({
    where: {
      id,
    },
    select: userWithPasswordSelect
  });
};

export const updatePassword = async (
  id,
  password,
  db = prisma
) => {
  return db.user.update({
    where: {
      id,
    },
    data: {
      password,
    },
    select: userSelect,
  });
};

const userRepository = {findUserById, updateUser, findPublicUserById, findUserForPasswordChange, updatePassword}

export default userRepository