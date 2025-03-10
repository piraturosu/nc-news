const db = require("../db/connection");

function fetchAllTopics() {
  return db
    .query("SELECT topics.slug, topics.description FROM topics")
    .then(({ rows }) => {
      return rows;
    });
}

module.exports = { fetchAllTopics };
