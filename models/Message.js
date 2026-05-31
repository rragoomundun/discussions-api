import { DataTypes } from 'sequelize';

import dbUtil from '../utils/db.util.js';

const Message = dbUtil.define(
  'Message',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    editedDate: {
      type: DataTypes.DATE
    },
    editionComment: {
      type: DataTypes.TEXT
    }
  },
  {
    timestamps: false,
    tableName: 'Message'
  }
);

export default Message;
