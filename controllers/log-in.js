import * as userDB from "../db/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";

const logIn = [
  async function logIn(req, res) {
    try {
      const user = await userDB.getUserByUsername(req.body.username);

      if (!user) {
        return res
          .status(403)
          .json({ errors: ["Invalid username or password!"] });
      }

      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return res
          .status(403)
          .json({ errors: ["Invalid username or password!"] });
      }

      const newToken =
        "bearer " + jwt.sign({ id: user.id }, process.env.JWTTOKEN);
      res.status(200).json({ username: user.username, token: newToken });
    } catch (error) {
      return res.status(500).json({ errors: ["Server error", error.message] });
    }
  },
];

export { logIn };
