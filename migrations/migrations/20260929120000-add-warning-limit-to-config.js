'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Config', 'warningLimit', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 10
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Config', 'warningLimit');
  }
};
