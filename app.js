const express = require("express");

const { apiRouter } = require("./routes/api-router");

const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = { app };
