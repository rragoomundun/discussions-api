// Set database associations

import User from './User.js';
import Token from './Token.js';
import Category from './Category.js';
import Forum from './Forum.js';
import Discussion from './Discussion.js';

const setupDBAssociations = () => {
  User.hasMany(Token, {
    foreignKey: {
      name: 'userId',
      allowNull: false
    },
    sourceKey: 'id',
    as: 'tokens'
  });
  Token.belongsTo(User, {
    foreignKey: {
      name: 'userId',
      allowNull: false
    },
    targetKey: 'id',
    as: 'user'
  });

  Category.hasMany(Forum, {
    foreignKey: {
      name: 'categoryId',
      allowNull: false
    },
    sourceKey: 'id',
    as: 'forums'
  });
  Forum.belongsTo(Category, {
    foreignKey: {
      name: 'categoryId',
      allowNull: false
    },
    targetKey: 'id',
    as: 'category'
  });

  Forum.hasMany(Discussion, {
    foreignKey: {
      name: 'forumId',
      allowNull: false
    },
    sourceKey: 'id',
    as: 'discussions'
  });
  Discussion.belongsTo(Forum, {
    foreignKey: {
      name: 'forumId',
      allowNull: false
    },
    targetKey: 'id',
    as: 'forum'
  });

  User.hasMany(Discussion, {
    foreignKey: {
      name: 'userId',
      allowNull: false
    },
    sourceKey: 'id',
    as: 'discussions'
  });
  Discussion.belongsTo(User, {
    foreignKey: {
      name: 'userId',
      allowNull: false
    },
    targetKey: 'id',
    as: 'user'
  });
};

export default setupDBAssociations;
