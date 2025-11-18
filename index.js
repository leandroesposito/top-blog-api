import "dotenv/config";
import express from "express";
import passport from "passport";
import jwtStrategy from "./auth/jwtStrategy.js";
import logInRouter from "./routes/logIn.js";
import signUpRouter from "./routes/signUp.js";
import postRouter from "./routes/post.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
passport.use(jwtStrategy);

app.use("/log-in", logInRouter);
app.use("/sign-up", signUpRouter);
app.use("/posts", postRouter);

app.get("/", (req, res) => {
  res.json({ message: "App running!" });
});

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.error(error);
    throw error;
  }

  console.log("App running listening on port ", process.env.PORT);
});
