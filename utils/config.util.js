import Config from '../models/Config.js';

const exists = async () => {
  return (await Config.count()) > 0;
};

export default { exists };
