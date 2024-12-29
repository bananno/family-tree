import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
});

export const uploadImageMiddleware = upload.single('image');

export async function uploadImageRoute(req, res) {
  console.log('---> Uploaded. FILE:')
  console.log(req.file)
  res.send('SUCCESS');
}
