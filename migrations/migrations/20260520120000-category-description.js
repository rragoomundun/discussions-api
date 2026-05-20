'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Category', 'description', {
      type: Sequelize.TEXT,
      after: 'name'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Category', 'description');
  }
};
