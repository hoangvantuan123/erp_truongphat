import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';
const uploadDirectory = process.env.UPLOAD_PATHS;

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

function generateShortUUID() {
  return Math.random().toString(36).substring(2, 7);
}

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString(
        'utf8',
      );

      const fileExt = extname(file.originalname);
      const baseName = path
        .basename(file.originalname, fileExt)
        .replace(/[^a-zA-Z0-9-_]/g, '');
      const uniqueFileName = `${baseName}-${generateShortUUID()}${fileExt}`;

      req.body.savedFileName = uniqueFileName;
      cb(null, uniqueFileName);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
};
