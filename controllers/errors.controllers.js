function handlePsqlErrors(err, req, res, next) {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ message: "Article doesn't exist." });
  } else {
    next(err);
  }
}

function handleCustomErrors(err, req, res, next) {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
}

function handleServerErrors(err, req, res, next) {
  console.log(err);
  res.status(500).send({ message: "Internal Server Error" });
}

module.exports = { handleCustomErrors, handleServerErrors, handlePsqlErrors };
