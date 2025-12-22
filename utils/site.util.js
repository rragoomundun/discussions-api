import ForumInfo from '../models/ForumInfo.js';

const isNew = async () => {
  const haveInfos = await ForumInfo.count();
  return haveInfos === 0;
};

export default { isNew };
