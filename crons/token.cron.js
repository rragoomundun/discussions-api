import cron from 'node-cron';
import { Op } from 'sequelize';

import Token from '../models/Token.js';

import userUtil from '../utils/user.util.js';

const clearTokens = () => {
  cron.schedule(process.env.CLEAR_TOKENS_CRON_DATE, async () => {
    // Delete register-confirm tokens with the respective user configuration
    const confirmTokens = await Token.findAll({
      where: {
        expire: { [Op.lt]: new Date() },
        type: 'register-confirm'
      }
    });
    const confirmTokensUserIds = confirmTokens.map((token) => token.dataValues.user_id);

    userUtil.deleteUsers(confirmTokensUserIds);

    // Delete password-reset token
    await Token.destroy({
      where: {
        expire: { [Op.lt]: new Date() },
        type: 'password-reset'
      }
    });
  });
};

export default { clearTokens };
