const { fetchArticles } = require("../models/articles.models");

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

module.exports = { getArticles };
