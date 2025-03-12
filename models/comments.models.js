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

module.exports = { insertComment, deleteComment };
