"use strict";
module.exports = (sequelize, DataTypes) => {
  const language = sequelize.define(
    "language",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  language.associate = function (models) {
    language.belongsTo(models.user);
  };
  return language;
};
