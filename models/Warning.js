import { DataTypes } from 'sequelize';

import dbUtil from '../utils/db.util.js';

const Warning = dbUtil.define(
  'Warning',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    message: {
      type: DataTypes.TEXT
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false,
    tableName: 'Warning'
  }
);

export default Warning;
