const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

require("dotenv/config");

app.use(cors());
app.options("*", cors());

//Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

//Routers
const usersRouter = require("./routers/users");
const snippetRouter = require("./routers/snippets");
const snippetTags = require("./routers/snippetTags");

const api = process.env.API_URL;
app.use(`${api}/users`, usersRouter);
app.use(`${api}/snippets`, snippetRouter);
app.use(`${api}/snippetTags`, snippetTags);

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:5000");
});
