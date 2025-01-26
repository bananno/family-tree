import mongoose from 'mongoose';

const UploadedFile = mongoose.model('UploadedFile');
const Person = mongoose.model('Person');
const PersonAvatar = mongoose.model('PersonAvatar');

export default async function createPersonAvatarRoute(req, res) {
  const person = await Person.findById(req.params.id);

  if (!person) {
    return res.status(404).send('Person not found');
  }

  const file = req.file;

  const uploadedFile = UploadedFile.newFromFile(file, {
    generateKey: true,
    directory: 'avatar',
  });

  await uploadedFile.save();
  await uploadedFile.executeUpload(file);

  person.avatar = await PersonAvatar.create({
    person: person._id,
    file: uploadedFile._id,
  });

  await person.save();

  res.send();
}
