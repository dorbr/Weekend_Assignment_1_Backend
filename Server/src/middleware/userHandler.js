const { UserDoesNotExist } = require("./errors");
const fs = require("fs");

const userHandler = (req, res, next) => {
  const username = req.headers.username;
  try {
    if (isUserExist(username)) {
      next();
    } else {
      throw new UserDoesNotExist();
    }
  } catch (error) {
    next(error);
  }
};

function isUserExist(user) {
  if (fs.existsSync(`./Server/src/db/users/${user}`)) return true;
  else {
    return false;
  }
}

module.exports = { userHandler };
