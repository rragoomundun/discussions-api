'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('forum_infos', 'title', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.changeColumn('forum_infos', 'created_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    });
    await queryInterface.addColumn('forum_infos', 'lang', {
      type: Sequelize.ENUM('en', 'fr'),
      defaultValue: 'en',
      allowNull: false
    });
    await queryInterface.renameTable('forum_infos', 'configs');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('configs', 'title', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.removeColumn('configs', 'lang');
    await queryInterface.renameTable('configs', 'forum_infos');
  }
};
