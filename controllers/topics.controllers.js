const { fetchAllTopics, createTopic } = require("../models/topics.models");

function getAllTopics(req, res, next) {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

function postTopic(req, res, next) {
  const { slug, description, img_url } = req.body;

  createTopic(slug, description, img_url)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
}

module.exports = { getAllTopics, postTopic };
