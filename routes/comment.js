import { Router } from "express";
import * as commentController from "../controllers/comment.js";

const commentRouter = Router();

commentRouter.delete("/:commentId", commentController.deleteCommentById);

export default commentRouter;
