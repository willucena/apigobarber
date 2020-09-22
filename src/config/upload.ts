import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';
  tmpFolder: string;
  uploadsFolder: string;
  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
  multer: {
    storage: StorageEngine;
  };
}
export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder: tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  config: {
    disk: {},
    aws: {
      bucket: 'app-gobarber',
    },
  },
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },
} as IUploadConfig;
