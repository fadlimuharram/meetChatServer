"use strict";
module.exports = (sequelize, DataTypes) => {
  const Relation = sequelize.define(
    "Relation",
    {
      user_one: DataTypes.INTEGER,
      user_two: DataTypes.INTEGER,
      status: {
        type: DataTypes.ENUM,
        values: ["request", "friend"],
        defaultValue: "request"
      }
    },
    {}
  );
  Relation.associate = function(models) {
    // associations can be defined here
  };
  return Relation;
};
