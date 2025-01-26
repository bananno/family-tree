import '../testDb.js';
import { res } from '../testTools.js';

import createPersonRoute from '../../app/person/createPerson.route.js';
import Person, { PERSON_GENDER } from '../../app/person/Person.model.js';

const req = {
  body: {
    name: 'Arthur Morgan',
    gender: 'male',
  },
};

async function callRoute() {
  await createPersonRoute(req, res);
}

describe('createPersonRoute', () => {
  beforeEach(async () => {
    await callRoute();
  });

  it('creates the person', async () => {
    const person = await Person.findOne();

    expect(person.name).toBe('Arthur Morgan');
    expect(person.customId).toBe('arthur-morgan');
    expect(person.gender).toBe(PERSON_GENDER.MALE);

    expect(res.json).toHaveBeenCalledWith({ person: { id: person.id } });
  });
});
