import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function createUser(user) {
  const newUser = await prisma.user.create({
    data: {
      username: user.username,
      password: user.password,
      isAuthor: user.isAuthor,
    },
  });

  return newUser;
}

async function getAllUsers() {
  const users = await prisma.user.findMany({
    omit: {
      password: true,
    },
  });

  return users;
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    omit: {
      password: true,
    },
  });

  return user;
}

async function getUserByUsername(username) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  return user;
}

async function updateUserById(user) {
  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      username: user.username,
      password: user.password,
      isAuthor: user.isAuthor,
    },
  });

  return updatedUser;
}

async function deleteUserById(id) {
  const user = await prisma.user.delete({
    where: {
      id: id,
    },
  });

  return user;
}

export {
  createUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUserById,
  deleteUserById,
};
