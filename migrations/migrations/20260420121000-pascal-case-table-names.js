'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename all tables to PascalCase, singular
    await queryInterface.renameTable('forums', 'Forum');
    await queryInterface.renameTable('categories', 'Category');
    await queryInterface.renameTable('bottom_links', 'BottomLink');
    await queryInterface.renameTable('configs', 'Config');
    await queryInterface.renameTable('users', 'User');
    await queryInterface.renameTable('tokens', 'Token');
  },

  async down(queryInterface, Sequelize) {
    // Revert table names to original plural/snake_case
    await queryInterface.renameTable('Forum', 'forums');
    await queryInterface.renameTable('Category', 'categories');
    await queryInterface.renameTable('BottomLink', 'bottom_links');
    await queryInterface.renameTable('Config', 'configs');
    await queryInterface.renameTable('User', 'users');
    await queryInterface.renameTable('Token', 'tokens');
  }
};
