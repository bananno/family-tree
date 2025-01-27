import mongoose from 'mongoose';

const Person = mongoose.model('Person');
const PersonAvatar = mongoose.model('PersonAvatar');

// Swap to an existing avatar for the person, or clear the selected avatar
// without deleting it.
export default async function updatePersonAvatarRoute(req, res) {
  const person = await Person.findById(req.params.id);

  if (!person) {
    return res.status(404).send('Person not found');
  }

  const avatarId = req.body.avatarId;

  if (!avatarId) {
    person.avatar = null;
    await person.save();
    return res.send();
  }

  const avatar = await PersonAvatar.findOne({ _id: avatarId, person: person._id });

  if (!avatar) {
    return res.status(404).send('Avatar not found');
  }

  person.avatar = avatar._id;
  await person.save();

  res.send();
}
