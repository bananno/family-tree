import _ from 'lodash';

import PersonModel, { PERSON_SHARE_LEVEL } from './Person.model.js';

export default async function listPeople(req, res) {
  const admin = req.session?.user?.admin;

  const items = admin ? await getItemsForAdmin() : await getItemsForNonAdmin();

  res.send({ items });
}

////////////////////

async function getItemsForAdmin() {
  const people = await PersonModel.find()
    .populateAvatar()
    .select('name gender avatar');

  return people.map(person => ({
    ...person.toListApi(),
    ..._.pick(person, ['shareLevel']),
  }));
}

async function getItemsForNonAdmin() {
  const people = await PersonModel.find({
    shareLevel: { $ne: PERSON_SHARE_LEVEL.NONE },
  })
    .populateAvatar()
    .select('name gender avatar shareLevel shareName');

  return people.map(person => person.toListApi({ restrict: true }));
}
