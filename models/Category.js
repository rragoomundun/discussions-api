import { DataTypes } from 'sequelize';

import dbUtil from '../utils/db.util.js';

const Category = dbUtil.define(
  'Category',
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
    index: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'categories'
  }
);

export default Category;
