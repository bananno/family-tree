import _ from 'lodash';
import Person, { PERSON_GENDER } from './Person.model.js';

export default async function createPersonRoute(req, res) {
  const person = await Person.create({
    name: req.body.name,
    customId: getCustomId(req.body.name),
    gender: getGender(req.body.gender),
  });

  res.json({ person: _.pick(person, ['id']) });
}

////////////////////

function getCustomId(personName) {
  return personName
    .toLowerCase()
    .replace(/\[|\]|\(|\)|\.|\//g, '')
    .replace(/ /g, '-');
}

function getGender(personGender) {
  return PERSON_GENDER[personGender.toUpperCase()] || PERSON_GENDER.UNKNOWN;
}
