const db = require("../db/connection");

function fetchAllTopics() {
  return db
    .query("SELECT topics.slug, topics.description FROM topics")
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "No topics found" });
      }
      return rows;
    });
}

module.exports = { fetchAllTopics };
