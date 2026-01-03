'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('configs', 'meta', 'meta_description');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('configs', 'meta_description', 'meta');
  }
};
