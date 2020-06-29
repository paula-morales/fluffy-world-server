"use strict";
module.exports = (sequelize, DataTypes) => {
  const service = sequelize.define(
    "service",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  service.associate = function (models) {
    service.hasMany(models.userservice);
  };
  return service;
};
