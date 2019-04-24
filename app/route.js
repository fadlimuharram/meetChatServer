const userAction = require("./action/UserAction");
const auth = require("./middleware/auth");

const prefix = "/api/v1";

module.exports = function(app) {
  app.post(prefix + "/register", userAction.create);
  app.post(prefix + "/login", userAction.login);
  app.get(
    prefix + "/users/recommendation",
    auth,
    userAction.getFriendRecommendataion
  );
};
