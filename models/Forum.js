import { DataTypes } from 'sequelize';

import dbUtil from '../utils/db.util.js';

const Forum = dbUtil.define(
  'Forum',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    meta_description: {
      type: DataTypes.STRING
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false, tableName: 'forums' }
);

export default Forum;
