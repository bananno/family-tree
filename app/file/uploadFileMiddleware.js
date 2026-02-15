import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
});

const uploadFileMiddleware = upload.single('file');

export default uploadFileMiddleware;
