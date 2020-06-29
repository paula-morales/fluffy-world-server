"use strict";
module.exports = (sequelize, DataTypes) => {
  const userService = sequelize.define(
    "userService",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rating: DataTypes.INTEGER,
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      picture: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {}
  );
  userService.associate = function (models) {
    // associations can be defined here
    userService.belongsTo(models.user);
    userService.belongsTo(models.service);
  };
  return userService;
};
