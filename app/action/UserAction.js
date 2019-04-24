const _ = require("lodash");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../../models").User;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class UserAction {
  static generateJWT(username, email, id) {
    return jwt.sign({ username, email, id }, process.env.APP_KEY_SECRET, {
      expiresIn: "30d"
    });
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async create(req, res) {
    let { username, email, password } = req.body;

    password = CryptoJS.AES.encrypt(
      password,
      process.env.APP_KEY_SECRET
    ).toString();

    const isEmailExist = await User.count({
      where: {
        email: email
      }
    });
    if (isEmailExist > 0) {
      return res.send({
        condition: 0,
        message: "user already exist"
      });
    }

    try {
      const user = await User.create({
        username,
        email,
        password,
        cover: "no_avatar.jpg"
      });

      return res.send({
        condition: 1,
        data: {
          id: user.id,
          username,
          email,
          cover: user.cover
        },
        access_token: {
          type: "bearer",
          token: UserAction.generateJWT(username, email, user.id)
        }
      });
    } catch (e) {
      console.log(e);
      return res.send({
        condition: 0,
        message: "db error insert new user"
      });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async login(req, res) {
    const { email, password } = req.body;
    if (email === "" || email === undefined) {
      return res.send({
        condition: 0,
        message: "Users validation failed: email: Path `email` is required."
      });
    }
    if (password === "" || password === undefined) {
      return res.send({
        condition: 0,
        message:
          "Users validation failed: password: Path `password` is required."
      });
    }

    const result = await User.findAll({
      where: {
        email: email
      }
    });

    console.log(result);

    if (result.length === 0)
      return res.status(404).send({ status: 0, messaeg: "user not found" });

    const decry = CryptoJS.AES.decrypt(
      result[0].password,
      process.env.APP_KEY_SECRET
    ).toString(CryptoJS.enc.Utf8);

    if (decry !== password) {
      return res.status(403).send({
        status: 0,
        message: "Wrong email or password"
      });
    }

    return res.send({
      data: {
        id: result[0].id,
        username: result[0].username,
        email: result[0].email,
        cover: result[0].cover
      },
      access_token: {
        type: "bearer",
        token: UserAction.generateJWT(result[0].username, email, result[0].id)
      }
    });
  }

  static async getFriendRecommendataion(req, res) {
    try {
      const recommendation = await User.findAll({
        where: {
          id: {
            [Op.ne]: req.user.id
          }
        }
      });

      return res.send({
        data: recommendation
      });
    } catch (e) {}
  }
}

module.exports = UserAction;
