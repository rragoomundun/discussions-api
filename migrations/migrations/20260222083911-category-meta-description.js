'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('categories', 'meta_description', {
      type: Sequelize.TEXT
    });
    await queryInterface.changeColumn('forums', 'description', {
      type: Sequelize.TEXT
    });
    await queryInterface.changeColumn('forums', 'meta_description', {
      type: Sequelize.TEXT
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('categories', 'meta_description');
    await queryInterface.changeColumn('forums', 'description', {
      type: Sequelize.STRING
    });
    await queryInterface.changeColumn('forums', 'meta_description', {
      type: Sequelize.STRING
    });
  }
};
