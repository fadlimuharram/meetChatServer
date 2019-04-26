const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const moment = require("moment");
const mysql = require("mysql");
require("dotenv").config();
const port = process.env.PORT || 3000;
const jwt = require("jsonwebtoken");
const path = require("path");
const socketIoJWT = require("socketio-jwt");
console.log(__dirname);

app.use("/static", express.static(path.join(__dirname, "public")));

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization,X-Requested-With,content-type"
  );

  next();
});

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
};

const db = mysql.createConnection(dbConfig);

db.connect(err => {
  if (err) console.log(err);
  console.log("connected");
});
global.db = db;

const route = require("./route")(app);

io.use(
  socketIoJWT.authorize({
    secret: process.env.APP_KEY_SECRET,
    handshake: true
  })
);

const user = {};
let idConnectedUser = [];
const MessageController = require("./controller/MessageController");

io.on("connection", socket => {
  console.log(socket.decoded_token);
  socket.id = socket.decoded_token.id;
  user[socket.id] = socket;
  idConnectedUser.push({
    id: socket.id
  });

  console.log("hello anda berhasil konek : ", socket.id);

  socket.broadcast.emit("online_users", idConnectedUser);

  socket.on("sendMessage", dataMessage => {
    var data = {};
    if (dataMessage.type === "file") {
      var base64Data = dataMessage.base64source.replace(
        /^data:image\/jpeg;base64,/,
        ""
      );
      console.log(__dirname);
      var crypto = require("crypto");
      var r = crypto.randomBytes(10).toString("hex");
      var filename = r + Date.now() + ".jpg";
      require("fs").writeFile(
        __dirname + "/public/uploads/" + filename,
        base64Data,
        "base64",
        function(err) {
          console.log(err);
        }
      );

      user[socket.id].emit("conditionFile", filename);

      data = {
        message: filename,
        type: "picture"
      };

      MessageController.create(socket.id, dataMessage.id, data);
    } else if (dataMessage.type === "text") {
      data = {
        type: "text",
        message: dataMessage.message
      };
      MessageController.create(socket.id, dataMessage.id, data);
    }

    console.log("---dt-->", data);

    if (user[dataMessage.id] && data) {
      user[dataMessage.id].emit("getMessage", data);
    }
  });

  socket.on("disconnect", () => {
    idConnectedUser = idConnectedUser.filter(val => val.id !== socket.id);
    socket.broadcast.emit("online_users", idConnectedUser);
    console.log(" diskoneksi");
  });
});

server.listen(port, () => {
  console.log("start pada port : " + port);
});
