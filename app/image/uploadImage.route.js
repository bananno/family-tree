import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(),
});

export async function uploadImage(req, res) {
  console.log('---> Uploaded. FILE:')
  console.log(req.file)
  res.send('SUCCESS');
}

