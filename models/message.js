"use strict";
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      type: {
        type: DataTypes.ENUM,
        values: ["text", "picture"],
        defaultValue: "text"
      }
    },
    {}
  );
  Message.associate = function(models) {
    // associations can be defined here
    Message.hasMany(models.Message_user);
    Message.hasOne(models.Message_text);
  };
  return Message;
};
