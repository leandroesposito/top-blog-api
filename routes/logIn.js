import { Router } from "express";
import * as logInController from "../controllers/log-in.js";

const logInRouter = Router();

logInRouter.post("/", logInController.logIn);

export default logInRouter;
