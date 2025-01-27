import mongoose from 'mongoose';

const Person = mongoose.model('Person');
const PersonAvatar = mongoose.model('PersonAvatar');
const UploadedFile = mongoose.model('UploadedFile');

export default async function deletePersonAvatarRoute(req, res) {
  const person = await Person.findById(req.params.id).select('avatar');
  const avatar = await PersonAvatar.findById(req.params.avatarId).populate(
    'file',
  );

  if (!person) {
    return res.status(404).send('Person not found');
  }

  if (!avatar || avatar.person.toString() !== person._id.toString()) {
    return res.status(404).send('Avatar not found');
  }

  await avatar.file.deleteRemote();

  await UploadedFile.deleteOne({ _id: avatar.file._id });
  await PersonAvatar.deleteOne({ _id: avatar._id });

  if (person.avatar.toString() === avatar._id.toString()) {
    person.avatar = null;
    await person.save();
  }

  res.send();
}
