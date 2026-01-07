import { DataTypes } from 'sequelize';

import dbUtil from '../utils/db.util.js';

const BottomLink = dbUtil.define(
  'BottomLink',
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
    link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'bottom_links'
  }
);

export default BottomLink;
