"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "userServices",
      [
        {
          title: "Happy paws",
          rating: 5,
          price: 15,
          description: "some description",
          picture: `https://picsum.photos/500/300?random=4`,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1,
          serviceId: 1,
        },
        {
          title: "Simba",
          rating: 5,
          price: 0,
          description: "some description",
          picture: `https://picsum.photos/500/300?random=5`,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 2,
          serviceId: 5,
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("userServices", null, {});
  },
};
