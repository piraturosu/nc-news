const express = require("express");

const { getApi } = require("./controllers/api.controllers");
const { getAllTopics } = require("./controllers/topics.controllers");
const {
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = { app };
