const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
});

async function uploadImage(req, res) {
  console.log('---> Uploaded. FILE:')
  console.log(req.file)
  res.send('SUCCESS');
}

module.exports = {
  uploadImageMiddleware: upload.single('image'),
  uploadImageRoute: uploadImage,
};
