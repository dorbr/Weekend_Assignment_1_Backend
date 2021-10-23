const express = require("express");
const app = express();
const port = 8080;
const pokemonRouter = require("./src/routers/pokemonRouter");
const userRouter = require("./src/routers/userRouter");
const {
  errorLogger,
  errorResponder,
  invalidPathHandler,
} = require("./src/middleware/errorHandler");
const { userHandler } = require("./src/middleware/userHandler");

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/pokemon", userHandler);
app.use("/pokemon", pokemonRouter);
app.use("/user", userRouter);

// middleware
app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

// start the server
app.listen(port, function () {
  console.log("Server started");
});

// route our app
app.get("/", function (req, res) {
  res.send("hello world!");
});
