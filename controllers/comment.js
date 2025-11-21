import { body, param } from "express-validator";
import authenticate from "./auth-validator.js";
import * as postDB from "../db/post.js";
import * as commentDB from "../db/comment.js";
import { checkValidations } from "./input-validator.js";
import { postExist } from "./post.js";

const validateCommentInputs = [
  body("author-name")
    .trim()
    .notEmpty()
    .withMessage("Author name can't be empty!"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content can't be empty!"),
];

function commentExist() {
  return param("commentId").custom(async (value, { req }) => {
    const id = value;
    const comment = await commentDB.getCommentById(id);

    if (!comment) {
      throw new Error(`Comment with the id ${id} doesn't exist!`);
    }

    req.comment = comment;
    return true;
  });
}

async function authorCanDelete(req, res, next) {
  const comment = req.comment;
  const post = await postDB.getPostById(comment.postId);

  if (post.authorId !== req.user.id) {
    return res.status(403).json({ errors: ["Not authorized"] });
  }

  next();
}

const createComment = [
  validateCommentInputs,
  postExist(),
  checkValidations,
  async function createComment(req, res) {
    const comment = {
      authorName: req.body["author-name"],
      content: req.body.content,
      postId: req.post.id,
    };

    const newComment = await commentDB.createComment(comment);

    if (newComment) {
      res
        .status(200)
        .json({ success: "Comment created succesfully!", comment: newComment });
    } else {
      res.status(500).json({ errors: ["Error creating new comment!"] });
    }
  },
];

const getCommentsByPostId = [
  postExist(),
  checkValidations,
  async function getCommentsByPostId(req, res) {
    const comments = await commentDB.getCommentsByPostId(req.post.id);

    res.status(200).json({ comments });
  },
];

const deleteCommentById = [
  authenticate(),
  commentExist(),
  checkValidations,
  authorCanDelete,
  async function deleteCommentById(req, res) {
    const deletedComment = await commentDB.deleteCommentById(req.comment.id);

    if (deletedComment) {
      res
        .status(200)
        .json({
          success: "Comment deleted sucessfuly",
          comment: deletedComment,
        });
    } else {
      res.status(500).json({ errors: ["Error deleting comment!"] });
    }
  },
];

export { createComment, getCommentsByPostId, deleteCommentById };
