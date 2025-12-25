import User from '../models/User.js';

const deleteUser = async (userId) => {
  await User.destroy({ where: { id: userId } });
};

export default { deleteUser };
