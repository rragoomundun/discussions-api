'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Warning', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      moderatorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
          key: 'id'
        },
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Warning');
  }
};
