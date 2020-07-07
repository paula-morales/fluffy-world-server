"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "userServices",
      [
        {
          title: "Happy paws",
          price: 15,
          description: "The best dog walker that you can find in Amsterdam!",
          picture: `https://ohmy.disney.com/wp-content/uploads/sites/25/2014/02/101Dalmatians-Anita.jpg`,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 2,
          serviceId: 1,
          availableFrom: 8,
          availableUntil: 16,
        },
        {
          title: "Simba",
          price: 0,
          description: "Friendly, adorable, cute",
          picture: `https://www.nicepng.com/png/full/914-9142519_doge-meme-dog-doggo-funny-sticker-momo-png.png`,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1,
          serviceId: 5,
          availableFrom: 10,
          availableUntil: 17,
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("userServices", null, {});
  },
};
