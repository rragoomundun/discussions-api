import { DataTypes } from 'sequelize';

import dbUtil from '../utils/db.util.js';

const Config = dbUtil.define(
  'Config',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING
    },
    favicon: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    metaDescription: {
      type: DataTypes.TEXT
    },
    lang: {
      type: DataTypes.ENUM('en', 'fr'),
      defaultValue: 'en',
      allowNull: false
    },
    showTitle: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    showLogo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'Config'
  }
);

export default Config;
