"use strict";
module.exports = (sequelize, DataTypes) => {
  const favorite = sequelize.define(
    "favorite",
    {
      userId: DataTypes.INTEGER,
      userServiceId: DataTypes.INTEGER,
    },
    {}
  );
  favorite.associate = function (models) {
    favorite.belongsTo(models.user);
    favorite.belongsTo(models.userService);
  };
  return favorite;
};
