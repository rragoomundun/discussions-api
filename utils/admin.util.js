import User from '../models/User.js';
import Token from '../models/Token.js';

const exists = async () => {
  const adminUser = await User.findOne({ where: { role: 'admin' } });

  if (adminUser) {
    const token = await Token.findOne({ where: { user_id: adminUser.id, type: 'register-confirm' } });

    if (token) {
      return false;
    }

    return true;
  }

  return false;
};

export default { exists };
