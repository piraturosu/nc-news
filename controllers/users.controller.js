const { fetchAllUsers } = require("../models/users.models");

function getAllUsers(req, res, next) {
  fetchAllUsers()
    .then((data) => {
      const users = data;
      res.status(200).send({ users });
    })
    .catch(next);
}

module.exports = { getAllUsers };
