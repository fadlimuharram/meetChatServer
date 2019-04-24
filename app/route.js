const userAction = require("./action/UserAction");
const messageAction = require("./action/MessageAction");
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
  app.get(prefix + "/messages/:idreceiver", auth, messageAction.index);
};
