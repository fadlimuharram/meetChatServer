const userAction = require("./action/UserAction");
const messageAction = require("./action/MessageAction");
const auth = require("./middleware/auth");
const multer = require("multer");
const path = require("path");
var crypto = require("crypto");
var r = crypto.randomBytes(10).toString("hex");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + "/public/uploads");
  },
  filename: function(req, file, cb) {
    cb(null, r + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const prefix = "/api/v1";

module.exports = function(app) {
  app.post(prefix + "/register", userAction.create);
  app.post(prefix + "/login", userAction.login);
  app.get(
    prefix + "/users/recommendation",
    auth,
    userAction.getFriendRecommendataion
  );
  app.get(
    prefix + "/messages/connection",
    auth,
    messageAction.messagaConnection
  );
  app.get(prefix + "/messages/:idreceiver", auth, messageAction.index);

  app.patch(
    prefix + "/users/cover",
    [auth, upload.single("cover")],
    userAction.changeCover
  );
};
