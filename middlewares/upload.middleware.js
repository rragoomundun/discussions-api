import fs from 'fs';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, calback) {
    let path = `public/uploads/`;

    if (req.body.category === 'forum') {
      path += `forum/`;
    } else {
      path += `user/${req.user.id}`;
    }

    fs.mkdirSync(path, { recursive: true });

    calback(null, path);
  },
  filename: function (req, file, calback) {
    calback(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

export default upload;
