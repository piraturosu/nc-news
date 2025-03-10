const express = require("express");

const { getApi } = require("./controllers/api.controllers");
const { getAllTopics } = require("./controllers/topics.controllers");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers");
const { getArticleById } = require("./controllers/articles.controller");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = { app };
