"use strict";
const bcrypt = require("bcrypt");
const { SALT_ROUNDS } = require("../config/constants");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          firstName: "Maria",
          lastName: "Owner",
          phoneNumber: 123456,
          profilePicture: `https://ya-webdesign.com/transparent250_/female-avatar-png-5.png`,
          email: "maria@test.com",
          password: bcrypt.hashSync("123", SALT_ROUNDS),
          latitude: 52.35033,
          longitude: 4.92288,
          isOwner: true,
          isCandidate: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Paula",
          lastName: "Services",
          phoneNumber: 123456,
          profilePicture: `https://ya-webdesign.com/transparent250_/avatar-icon-png-1.png`,
          email: "pmpoclava@gmail.com",
          password: bcrypt.hashSync("123", SALT_ROUNDS),
          latitude: 52.35195,
          longitude: 4.92803,
          isOwner: false,
          isCandidate: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
