import { Router } from "express";
import * as postController from "../controllers/post.js";
import * as commentController from "../controllers/comment.js";
const postRouter = Router();

postRouter.post("/", postController.createPost);
postRouter.post("/:postId/comments", commentController.createComment);
postRouter.get("/", postController.getAllPosts);
postRouter.get("/:postId", postController.getPostById);
postRouter.get("/author/:authorId", postController.getPostsByAuthorId);
postRouter.get("/:postId/comments", commentController.getCommentsByPostId);
postRouter.put("/:postId", postController.updatePost);
postRouter.delete("/:postId", postController.deletePostById);

export default postRouter;
