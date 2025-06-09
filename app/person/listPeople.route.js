import _ from 'lodash';
import mongoose from 'mongoose';

const Person = mongoose.model('Person');

export default async function listPeople(req, res) {
  const people = await Person.find()
    .populateAvatar()
    .select('name gender avatar shareLevel');

  const items = people.map(person => ({
    ...person.toListApi(),
    ..._.pick(person, ['shareLevel']),
  }));

  res.send({ items });
}
