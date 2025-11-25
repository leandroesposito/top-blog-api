import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function createPost(post) {
  const newPost = await prisma.post.create({
    data: {
      title: post.title,
      content: post.content,
      isPublished: post.isPublished,
      authorId: post.authorId,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
    },
  });

  return newPost;
}

async function getAllPosts() {
  const posts = await prisma.post.findMany({
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
    },
  });

  return posts;
}

async function getPostById(id) {
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
    },
  });

  return post;
}

async function getPostsByAuthorId(id) {
  const posts = await prisma.post.findMany({
    where: {
      authorId: id,
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
    },
  });

  return posts;
}

async function updatePost(post) {
  const updatedPost = await prisma.post.update({
    where: {
      id: post.id,
    },
    data: {
      title: post.title,
      content: post.content,
      isPublished: post.isPublished,
    },
  });

  return updatedPost;
}

async function deletePostById(id) {
  const deletedPost = await prisma.post.delete({
    where: {
      id: id,
    },
  });

  return deletedPost;
}

export {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByAuthorId,
  updatePost,
  deletePostById,
};
