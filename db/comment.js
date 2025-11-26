import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function createComment(comment) {
  const newComment = await prisma.comment.create({
    data: {
      authorName: comment.authorName,
      content: comment.content,
      postId: comment.postId,
    },
  });

  return newComment;
}

async function getAllComments() {
  const comments = await prisma.comment.findMany({
    orderBy: {
      date: "desc",
    },
  });

  return comments;
}

async function getCommentById(id) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: id,
    },
  });

  return comment;
}

async function getCommentsByPostId(id) {
  const comments = await prisma.comment.findMany({
    where: {
      postId: id,
    },
    orderBy: {
      date: "desc",
    },
  });

  return comments;
}

async function updateComment(comment) {
  const updatedComment = await prisma.comment.update({
    where: {
      id: comment.id,
    },
    data: {
      authorName: comment.authorName,
      content: comment.content,
      postId: comment.postId,
    },
  });

  return updatedComment;
}

async function deleteCommentById(id) {
  const deletedComment = await prisma.comment.delete({
    where: {
      id: id,
    },
  });

  return deletedComment;
}

export {
  createComment,
  getAllComments,
  getCommentById,
  getCommentsByPostId,
  updateComment,
  deleteCommentById,
};
