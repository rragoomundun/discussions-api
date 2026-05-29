import fs from 'fs';
import multer from 'multer';

const MIME_EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
};

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
    calback(null, `${Date.now()}${MIME_EXTENSIONS[file.mimetype] ?? ''}`);
  }
});
const upload = multer({ storage });

export default upload;
