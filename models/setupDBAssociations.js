// Set database associations

import User from './User.js';
import Token from './Token.js';
import Category from './Category.js';
import Forum from './Forum.js';

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

  Category.hasMany(Forum, {
    foreignKey: {
      name: 'category_id',
      allowNull: false
    }
  });
  Forum.belongsTo(Category, {
    foreignKey: {
      name: 'category_id',
      allowNull: false
    }
  });
};

export default setupDBAssociations;
