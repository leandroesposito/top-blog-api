import { body, param } from "express-validator";
import authenticate from "./auth-validator.js";
import * as postDB from "../db/post.js";
import * as userDB from "../db/user.js";
import { checkValidations } from "./input-validator.js";

const validatePostInputs = [
  body("title").trim().notEmpty().withMessage("Post title can't be empty!"),
  body("content").trim().notEmpty().withMessage("Post content can't be empty!"),
  body("is-published")
    .isBoolean()
    .withMessage("Published status must be a boolean!"),
];

function authorExist() {
  return param("authorId").custom(async (value, { req }) => {
    const id = value;
    const author = await userDB.getUserById(id);

    if (!author) {
      throw new Error(`Author with the id ${id} doesn't exist!`);
    }

    req.author = author;
    return true;
  });
}

function postExist() {
  return param("postId").custom(async (value, { req }) => {
    const id = value;
    const post = await postDB.getPostById(id);

    if (!post) {
      throw new Error(`Post with the id ${id} doesn't exist!`);
    }

    req.post = post;
    return true;
  });
}

function postBelongToUser() {
  return param("postId").custom(async (value, { req }) => {
    if (!req.post) {
      return false;
    }

    if (req.post.authorId !== req.user.id) {
      throw new Error("Not authorized");
    }
    return true;
  });
}

const createPost = [
  authenticate(true),
  validatePostInputs,
  checkValidations,
  async function createPost(req, res) {
    const post = {
      title: req.body.title,
      content: req.body.content,
      isPublished: req.body["is-published"],
      authorId: req.user.id,
    };

    const newPost = await postDB.createPost(post);

    if (newPost) {
      res
        .status(200)
        .json({ success: "Post created succesfully!", post: newPost });
    } else {
      res.status(500).json({ errors: ["Error creating new post!"] });
    }
  },
];

const getAllPosts = [
  authenticate(false, false),
  async function getAllPosts(req, res) {
    let posts = await postDB.getAllPosts();

    posts = posts.filter((post) => {
      return post.isPublished || (req.user && req.user.id === post.authorId);
    });

    res.status(200).json({ posts });
  },
];

const getPostById = [
  postExist(),
  checkValidations,
  authenticate(false, false),
  async function getPostById(req, res) {
    if (
      !req.post.isPublished &&
      (!req.user || req.user.id !== req.post.authorId)
    ) {
      return res.status(403).json({ errors: ["Unauthorized"] });
    }

    return res.status(200).json({ post: req.post });
  },
];

const getPostsByAuthorId = [
  authorExist(),
  checkValidations,
  authenticate(false, false),
  async function getPostsByAuthorId(req, res) {
    let posts = await postDB.getPostsByAuthorId(req.author.id);

    posts = posts.filter((post) => {
      return post.isPublished || (req.user && req.user.id === post.authorId);
    });

    res.status(200).json({ posts });
  },
];

const updatePost = [
  authenticate(),
  validatePostInputs,
  postExist(),
  postBelongToUser(),
  checkValidations,
  async function updatePost(req, res) {
    const newData = {
      id: req.post.id,
      title: req.body.title,
      content: req.body.content,
      isPublished: req.body["is-published"],
    };

    const updatedPost = await postDB.updatePost(newData);
    console.dir(updatedPost);

    if (updatedPost) {
      res
        .status(200)
        .json({ success: "Post updated succesfully!", post: updatedPost });
    } else {
      res.status(500).json({ errors: ["Error updating new post!"] });
    }
  },
];

const deletePostById = [
  authenticate(),
  postExist(),
  postBelongToUser(),
  checkValidations,
  async function deletePostById(req, res) {
    const deletedPost = await postDB.deletePostById(req.post.id);

    if (deletedPost) {
      res
        .status(200)
        .json({ success: "Post deleted sucessfuly", post: deletedPost });
    } else {
      res.status(500).json({ errors: ["Error deleting post!"] });
    }
  },
];

export {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByAuthorId,
  updatePost,
  deletePostById,
  postExist,
  postBelongToUser,
};
