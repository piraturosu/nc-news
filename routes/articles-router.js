const express = require("express");

const {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  patchArticleById,
} = require("../controllers/articles.controller");

const { postComment } = require("../controllers/comments.controllers");

const articlesRouter = express.Router();

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.post("/:article_id/comments", postComment);
articlesRouter.patch("/:article_id", patchArticleById);

module.exports = { articlesRouter };
