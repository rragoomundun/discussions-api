import User from '../models/User.js';

const deleteUser = async (userId) => {
  await User.destroy({ where: { id: userId } });
};

const deleteUsers = async (userIds) => {
  await User.destroy({ where: { id: userIds } });
};

export default { deleteUser, deleteUsers };
