"use strict";
module.exports = (sequelize, DataTypes) => {
  const Message_text = sequelize.define(
    "Message_text",
    {
      content: DataTypes.TEXT,
      message_id: DataTypes.INTEGER
    },
    {}
  );
  Message_text.associate = function(models) {
    // associations can be defined here
    Message_text.belongsTo(models.Message);
  };
  return Message_text;
};
