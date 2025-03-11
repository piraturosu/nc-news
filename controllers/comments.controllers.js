const { insertComment } = require("../models/comments.models");

function postComment(req, res, next) {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
}

module.exports = { postComment };
