import { DataTypes } from 'sequelize';

import dbUtil from '../utils/db.util.js';
import cryptUtil from '../utils/crypt.util.js';

const Token = dbUtil.define(
  'Token',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    expire: {
      type: DataTypes.DATE,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('register-confirm', 'password-reset'),
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'tokens',
    hooks: {
      beforeCreate: (token) => {
        token.value = cryptUtil.getDigestHash(cryptUtil.getToken());
        token.expire = Date.now() + 1000 * 60 * 60; // Expires in 1 hour
      }
    }
  }
);

export default Token;
