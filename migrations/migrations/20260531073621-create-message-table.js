'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Message', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      editedDate: {
        type: Sequelize.DATE
      },
      editionComment: {
        type: Sequelize.TEXT
      },
      discussionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Discussion',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      editorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
          key: 'id'
        },
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Message');
  }
};
