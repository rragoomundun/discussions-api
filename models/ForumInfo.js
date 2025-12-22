import { DataTypes } from 'sequelize';

import dbUtil from '../utils/db.util.js';

const ForumInfo = dbUtil.define(
  'ForumInfo',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false,
    tableName: 'forum_infos'
  }
);

export default ForumInfo;
