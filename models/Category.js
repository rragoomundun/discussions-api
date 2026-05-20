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
    description: {
      type: DataTypes.TEXT
    },
    metaDescription: {
      type: DataTypes.TEXT
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'Category'
  }
);

export default Category;
