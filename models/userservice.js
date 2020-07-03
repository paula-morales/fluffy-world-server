"use strict";
module.exports = (sequelize, DataTypes) => {
  const userService = sequelize.define(
    "userService",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

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
      availableFrom: DataTypes.STRING,

      availableUntil: DataTypes.STRING,
    },
    {}
  );
  userService.associate = function (models) {
    // associations can be defined here
    userService.belongsTo(models.user);
    userService.belongsTo(models.service);
    userService.hasMany(models.review);
    userService.belongsToMany(models.user, {
      through: "favorites",
      foreignKey: "userServiceId",
    });
  };
  return userService;
};
