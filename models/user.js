"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      cover: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Message_user, {
      foreignKey: "sender"
    });
    User.hasMany(models.Message_user, {
      foreignKey: "receiver"
    });
  };
  return User;
};
