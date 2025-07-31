const {
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  updateArticleVotes,
  createArticle,
  deleteArticle,
} = require("../models/articles.models");

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((data) => {
      const article = data;
      res.status(200).send({ article });
    })
    .catch(next);
}

function getAllArticles(req, res, next) {
  const { sort_by, order, topic, page } = req.query;

  if (isNaN(page) || page < 1) {
    return next({
      status: 400,
      message: "Bad request. Page must be a positive number",
    });
  }

  fetchAllArticles(sort_by, order, topic, 10, page)
    .then(({articles, totalArticles}) => {
      res.status(200).send({ articles, totalArticles });
    })
    .catch(next);
}

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((data) => {
      res.status(200).send({ comments: data });
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticleById(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotes(article_id, inc_votes)
    .then((data) => {
      const article = data[0];
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
}

function postArticle(req, res, next) {
  const { author, title, body, topic, article_img_url } = req.body;

  createArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function deleteArticleById(req, res, next) {
  const { article_id } = req.params;
  deleteArticle(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

module.exports = {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  patchArticleById,
  postArticle,
  deleteArticleById,
};
