const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const MessageController = require("../controller/MessageController");

class MessageAction {
  static async index(req, res) {
    console.log("param->", req.params.idreceiver);
    const message = await MessageController.index(
      req.user.id,
      req.params.idreceiver
    );
    return res.send({
      data: message[0]
    });
  }
}

module.exports = MessageAction;
