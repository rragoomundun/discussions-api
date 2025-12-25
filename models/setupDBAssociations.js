// Set database associations

import User from './User.js';
import Token from './Token.js';

const setupDBAssociations = () => {
  User.hasMany(Token, {
    foreignKey: {
      name: 'user_id',
      allowNull: false
    }
  });
  Token.belongsTo(User, {
    foreignKey: {
      name: 'user_id',
      allowNull: false
    }
  });
};

export default setupDBAssociations;
