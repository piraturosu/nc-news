const express = require("express");

const { getApi } = require("./controllers/api.controllers");
const { getAllTopics } = require("./controllers/topics.controllers");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers");
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  patchArticleById,
} = require("./controllers/articles.controller");
const {
  postComment,
  deleteCommentById,
} = require("./controllers/comments.controllers");

const { getAllUsers } = require("./controllers/users.controller");

const app = express();

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getAllUsers);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = { app };
