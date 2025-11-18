import { Router } from "express";
import * as signUpController from "../controllers/sign-up.js";

const signUpRouter = Router();

signUpRouter.post("/", signUpController.signUp);

export default signUpRouter;
