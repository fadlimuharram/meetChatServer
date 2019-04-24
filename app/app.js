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

io.on("connection", socket => {
  console.log("hello anda berhasil konek");
  socket.on("chat message", msg => {
    console.log(msg);
    io.emit("chat messages", msg);
  });
});

server.listen(port, () => {
  console.log("start pada port : " + port);
});
