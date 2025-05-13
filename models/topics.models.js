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

function createTopic(slug, description, img_url) {
  if (!slug || !description) {
    return Promise.reject({
      status: 400,
      message:
        "Required fields not completed. Please add fields slug and description.",
    });
  }

  const topicArr = [slug, description, img_url];
  return db
    .query(
      "INSERT INTO topics (slug, description, img_url) VALUES ($1, $2, $3) RETURNING *",
      topicArr,
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = { fetchAllTopics, createTopic };
