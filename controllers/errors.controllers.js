function handleCustomErrors(err, req, res, next) {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
}

function handleServerErrors(err, req, res, next) {
  res.status(500).send({ message: "Internal Server Error" });
}

module.exports = { handleCustomErrors, handleServerErrors };
