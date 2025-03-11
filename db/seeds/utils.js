const db = require("../../db/connection");
const format = require("pg-format");

function convertTimestampToDate({ created_at, ...otherProperties }) {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
}

function checkItemExists(table, column, value) {
  const queryString = format("SELECT * FROM %I WHERE %I = $1", table, column);

  return db.query(queryString, [value]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "Item not found" });
    }
  });
}

module.exports = { convertTimestampToDate, checkItemExists };
