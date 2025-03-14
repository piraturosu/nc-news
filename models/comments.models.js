const db = require("../db/connection");
const { checkItemExists } = require("../db/seeds/utils");

function insertComment(article_id, username, body) {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      message:
        "Required field not completed. Please provide username and body.",
    });
  }
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
      [article_id, username, body],
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function deleteComment(id) {
  return checkItemExists("comments", "comment_id", id).then(() => {
    return db.query("DELETE FROM comments WHERE comment_id = $1", [id]);
  });
}

function updateCommentVotesById(id, votes) {
  if (!votes) {
    return Promise.reject({
      status: 400,
      message: "Required field not completed. Please provide inc_votes",
    });
  }
  return checkItemExists("comments", "comment_id", id).then(() => {
    return db
      .query(
        "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;",
        [votes, id],
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
}

module.exports = { insertComment, deleteComment, updateCommentVotesById };
