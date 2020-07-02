"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "reviews",
      [
        {
          rating: 4,
          comment: "Highly recommended!",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1,
          userServiceId: 1,
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("reviews", null, {});
  },
};
