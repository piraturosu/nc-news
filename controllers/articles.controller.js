const { fetchArticles } = require("../models/articles.models");

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  fetchArticles(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticleById };
