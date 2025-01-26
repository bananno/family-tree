import mongoose from 'mongoose';

const Person = mongoose.model('Person');
const PersonAvatar = mongoose.model('PersonAvatar');

export default async function getPersonAvatarsRoute(req, res) {
  const person = await Person.findById(req.params.id);

  if (!person) {
    return res.status(404).send('Person not found');
  }

  const avatars = await PersonAvatar.find({ person: person.id }).sort({
    createdAt: -1,
  }).populate('file');

  res.json({
    data: avatars.map(avatar => avatar.toApi()),
  });
}
