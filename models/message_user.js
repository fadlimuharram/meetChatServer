"use strict";
module.exports = (sequelize, DataTypes) => {
  const Message_user = sequelize.define(
    "Message_user",
    {
      sender: DataTypes.INTEGER,
      receiver: DataTypes.INTEGER,
      message_id: DataTypes.INTEGER
    },
    {}
  );
  Message_user.associate = function(models) {
    // associations can be defined here
    Message_user.belongsTo(models.Message, {
      foreignKey: "message_id"
    });
    Message_user.belongsTo(models.User, {
      foreignKey: "sender",
      targetKey: "id"
    });
    Message_user.belongsTo(models.User, {
      foreignKey: "receiver",
      targetKey: "id"
    });
  };
  return Message_user;
};
