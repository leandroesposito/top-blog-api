import { body } from "express-validator";
import * as userDB from "../db/user.js";
import { checkValidations } from "./input-validator.js";
import bcrypt from "bcryptjs";

const signUp = [
  body("username")
    .trim()
    .toLowerCase()
    .isLength({ min: 4, max: 20 })
    .withMessage("Username must be between 4 and 20 characters inclusive!")
    .custom(async (value) => {
      const user = await userDB.getUserByUsername(value);
      if (user) {
        throw new Error("Username already exist, please pick other!");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters!"),
  body("confirm-password").custom((value, { req }) => {
    if (value !== req.body["password"]) {
      throw new Error("Password must be equal to password confirmation!");
    }
    return true;
  }),
  body("is-author").isBoolean().withMessage("Is author must be a boolean"),
  checkValidations,
  async function signUp(req, res) {
    if (res.locals.errors) {
      return res.json({ errors: res.locals.errors });
    }

    const user = {
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 10),
      isAuthor: req.body["is-author"],
    };

    const newUser = await userDB.createUser(user);

    if (newUser) {
      res.status(200).json({ message: "User create succesfuly" });
    } else {
      res.status(500).json({ errors: ["Error creating user"] });
    }
  },
];

export { signUp };
