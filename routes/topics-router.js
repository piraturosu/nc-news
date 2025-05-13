const express = require("express");

const {
  getAllTopics,
  postTopic,
} = require("../controllers/topics.controllers");

const topicsRouter = express.Router();

topicsRouter.get("/", getAllTopics);
topicsRouter.post("/", postTopic);

module.exports = { topicsRouter };
