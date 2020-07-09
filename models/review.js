"use strict";
module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define(
    "review",
    {
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {}
  );
  review.associate = function (models) {
    review.belongsTo(models.user);
    review.belongsTo(models.userService);
  };
  return review;
};
