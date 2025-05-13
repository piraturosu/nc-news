const express = require("express");

const {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  patchArticleById,
  postArticle,
  deleteArticleById,
} = require("../controllers/articles.controller");

const { postComment } = require("../controllers/comments.controllers");

const articlesRouter = express.Router();

articlesRouter.get("/", getAllArticles);
articlesRouter.post("/", postArticle);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.post("/:article_id/comments", postComment);
articlesRouter.patch("/:article_id", patchArticleById);
articlesRouter.delete("/:article_id", deleteArticleById);

module.exports = { articlesRouter };
