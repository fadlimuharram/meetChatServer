const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Message = require("../../models").Message;
const Message_text = require("../../models").Message_text;
const Message_User = require("../../models").Message_user;

class MessageController {
  static async create(sender, receiver, data) {
    try {
      const message = await Message.create({
        type: data.type
      });

      const messageText = await Message_text.create({
        message_id: message.id,
        content: data.message
      });

      const messageUser = Message_User.create({
        sender: sender,
        receiver: receiver,
        message_id: message.id
      })
        .then(dt => console.log(dt))
        .catch(e => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  }

  static async index(sender, receiver) {
    // const message = await Message_User.findAll({
    //   where: {
    //     [Op.or]: {
    //       [Op.and]: {
    //         sender: {
    //           [Op.eq]: sender
    //         },
    //         receiver: {
    //           [Op.eq]: receiver
    //         }
    //       },
    //       [Op.and]: {
    //         receiver: {
    //           [Op.eq]: sender
    //         },
    //         sender: {
    //           [Op.eq]: receiver
    //         }
    //       }
    //     }
    //   }
    // });

    const message = await Message_User.sequelize.query(
      `SELECT message_users.sender, message_users.receiver, messages.type as typeData, Message_texts.content, messages.createdAt, messages.updatedAt  FROM message_users 
        INNER JOIN messages on messages.id=message_users.message_id 
        LEFT JOIN Message_texts on Message_texts.message_id=messages.id
      WHERE sender=${sender} and receiver=${receiver} or receiver=${sender} and sender=${receiver}`
    );
    console.log("---------->");
    console.log(message);
    console.log("---------->");
    return message;
  }

  static async messageConnection(loggedInId) {
    const messages = await Message_User.sequelize.query(
      `select Users.username, MAX(Message_texts.content) as message, MAX(Message_texts.createdAt) as createdAt, MAX(Users.id) as receiver,  MAX(Users.cover) as cover from Users 
      INNER JOIN message_users ON message_users.receiver=Users.id OR message_users.sender=Users.id 
      INNER JOIN messages ON message_users.message_id=messages.id
      INNER JOIN Message_texts on messages.id=Message_texts.message_id
    where Users.id <> ${loggedInId} and (message_users.receiver=${loggedInId} or message_users.sender=${loggedInId})
    GROUP BY username`
    );

    return messages;
  }
}

module.exports = MessageController;
