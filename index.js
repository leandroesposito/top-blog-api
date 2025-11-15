import "dotenv/config";
import express from "express";

const app = express();

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
