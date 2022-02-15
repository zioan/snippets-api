const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET;
  const api = process.env.API_URL;
  return expressJwt({
    secret,

    //help to access current user properties in routes.
    userProperty: "payload",
    algorithms: ["HS256"],
  }).unless({
    path: [`${api}/users/login`, `${api}/users/register`, ""],
  });
}

module.exports = authJwt;
