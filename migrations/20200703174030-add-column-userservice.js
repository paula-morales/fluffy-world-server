"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("userServices", "availableFrom", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("userServices", "availableUntil", {
      type: Sequelize.INTEGER,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("userServices", "availableFrom");
    await queryInterface.removeColumn("userServices", "availableUntil");
  },
};
