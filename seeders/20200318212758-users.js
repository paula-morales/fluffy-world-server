"use strict";
const bcrypt = require("bcrypt");
const { SALT_ROUNDS } = require("../config/constants");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          firstName: "owner",
          lastName: "test",
          phoneNumber: 123456,
          profilePicture: `https://picsum.photos/500/300?random=1`,
          email: "owner@test.com",
          password: bcrypt.hashSync("123", SALT_ROUNDS),
          latitude: 52.35033,
          longitude: 4.92288,
          isOwner: true,
          isCandidate: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "candidate",
          lastName: "test",
          phoneNumber: 123456,
          profilePicture: `https://picsum.photos/500/300?random=2`,
          email: "candidate@test.com",
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
