'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Forum table
    await queryInterface.renameColumn('forums', 'meta_description', 'metaDescription');
    // Category table
    await queryInterface.renameColumn('categories', 'meta_description', 'metaDescription');
    // Config table
    await queryInterface.renameColumn('configs', 'meta_description', 'metaDescription');
    await queryInterface.renameColumn('configs', 'show_title', 'showTitle');
    await queryInterface.renameColumn('configs', 'show_logo', 'showLogo');
    await queryInterface.renameColumn('configs', 'created_at', 'createdAt');
    // User table
    await queryInterface.renameColumn('users', 'created_at', 'createdAt');
    // Token table
    await queryInterface.renameColumn('tokens', 'user_id', 'userId');
    // Forum table (category_id to categoryId)
    await queryInterface.renameColumn('forums', 'category_id', 'categoryId');
  },

  async down(queryInterface, Sequelize) {
    // Forum table
    await queryInterface.renameColumn('forums', 'metaDescription', 'meta_description');
    // Category table
    await queryInterface.renameColumn('categories', 'metaDescription', 'meta_description');
    // Config table
    await queryInterface.renameColumn('configs', 'metaDescription', 'meta_description');
    await queryInterface.renameColumn('configs', 'showTitle', 'show_title');
    await queryInterface.renameColumn('configs', 'showLogo', 'show_logo');
    await queryInterface.renameColumn('configs', 'createdAt', 'created_at');
    // User table
    await queryInterface.renameColumn('users', 'createdAt', 'created_at');
    // Token table
    await queryInterface.renameColumn('tokens', 'userId', 'user_id');
    // Forum table (categoryId to category_id)
    await queryInterface.renameColumn('forums', 'categoryId', 'category_id');
  }
};
