const {
  fetchArticles,
  fetchCommentsByArticleId,
  updateArticleVotes,
} = require("../models/articles.models");

function getArticles(req, res, next) {
  const { article_id } = req.params;
  fetchArticles(article_id)
    .then((data) => {
      if (article_id) {
        res.status(200).send({ article: data });
      } else {
        res.status(200).send({ articles: data });
      }
    })
    .catch((err) => {
      next(err);
    });
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

module.exports = { getArticles, getCommentsByArticleId, patchArticleById };
