const { fetchAllTopics } = require("../models/topics.models");

function getAllTopics(req, res, next) {
  fetchAllTopics()
    .then((topics) => {
      if (topics.length === 0) {
        return Promise.reject({ status: 404, message: "No topics found" });
      }
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getAllTopics };
