const db = require("../db/connection");
const { checkItemExists } = require("../db/seeds/utils");

function fetchAllUsers() {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "No users found" });
    }
    return rows;
  });
}

function fetchUserByUsername(id) {
  return checkItemExists("users", "username", id).then(() => {
    return db
      .query("SELECT * FROM users WHERE username = $1", [id])
      .then(({ rows }) => {
        return rows[0];
      });
  });
}

module.exports = { fetchAllUsers, fetchUserByUsername };
