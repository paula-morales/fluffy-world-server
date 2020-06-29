"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "services",
      [
        {
          name: "dog walking",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "pet trainer",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "pet taxi",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "grooming",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "pet friends",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("services", null, {});
  },
};
