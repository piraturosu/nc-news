const {
  fetchAllUsers,
  fetchUserByUsername,
} = require("../models/users.models");

function getAllUsers(req, res, next) {
  fetchAllUsers()
    .then((data) => {
      const users = data;
      res.status(200).send({ users });
    })
    .catch(next);
}

function getUserByUsername(req, res, next) {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
}

module.exports = { getAllUsers, getUserByUsername };
