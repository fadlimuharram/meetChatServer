const jwt = require("jsonwebtoken");

const veirfyJWTToken = function(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.APP_KEY_SECRET, (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject(err);
      }
      resolve(decodedToken);
    });
  });
};

module.exports = function(req, res, next) {
  console.log(req.headers.authorization);
  let token = req.headers.authorization;

  if (!token) {
    return res.status(400).send({
      message: "auth token is required"
    });
  }

  if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
    token = token.slice(7, token.length);
  }

  veirfyJWTToken(token)
    .then(decodedToken => {
      console.log(decodedToken);
      req.user = {
        id: decodedToken.id,
        username: decodedToken.username,
        email: decodedToken.email
      };
      next();
    })
    .catch(err => {
      res.status(400).send({
        message: "Invalid auth token provided."
      });
    });
};
