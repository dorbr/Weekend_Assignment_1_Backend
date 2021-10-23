const express = require("express");
const router = express();
const fs = require("fs");
const { Server } = require("tls");
const { UserDoesNotExist, ServerError } = require("../middleware/errors");

router.get("/info", async function (request, response, next) {
  const username = request.headers.username;
  try {
    if (await isUserExist(username)) {
      response.send(username);
    } else {
      throw new UserDoesNotExist();
    }
  } catch (error) {
    next(error);
  }
});
router.put("/createUser", async function (request, response, next) {
  const username = request.headers.username;
  try {
    if (!isUserExist(username)) {
      fs.mkdirSync(`./Server/src/db/users/${username}`);
      response.send(username);
    } else throw new ServerError();
  } catch (error) {
    next(error);
  }
});
function isUserExist(user) {
  if (fs.existsSync(`./Server/src/db/users/${user}`)) return true;
  else {
    return false;
  }
}
module.exports = router;
