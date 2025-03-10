const db = require("../db/connection");

function fetchArticles(article_id) {
  let queryString = "SELECT * FROM articles ";
  const queryParams = [];

  if (article_id) {
    queryParams.push(article_id);
    queryString += " WHERE article_id = $1";
  }
  return db.query(queryString, queryParams).then(({ rows }) => {
    const article = rows[0];
    console.log(JSON.stringify(article));
    if (!article) {
      return Promise.reject({
        status: 404,
        message: "Article not found",
      });
    } else {
      return article;
    }
  });
}

module.exports = { fetchArticles };
