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
    description: {
      type: DataTypes.TEXT
    },
    meta: {
      type: DataTypes.TEXT
    },
    show_title: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_logo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lang: {
      type: DataTypes.ENUM('en', 'fr'),
      defaultValue: 'en',
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'configs'
  }
);

export default Config;
