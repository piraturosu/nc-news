const { insertComment, deleteComment } = require("../models/comments.models");

function postComment(req, res, next) {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
}

function deleteCommentById(req, res, next) {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

module.exports = { postComment, deleteCommentById };
