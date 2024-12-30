import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
});

export const uploadFileMiddleware = upload.single('file');

export async function uploadFileRoute(req, res) {
  console.log('---> Uploaded. FILE:')
  console.log(req.file)
  res.send('SUCCESS');
}
