import './testDb.js';
import { expectResStatus, res } from './testTools.js';

import getPersonRoute from '../app/person/getPerson.route';
import Person, { PERSON_GENDER } from '../app/person/Person.model';

const personId = '5bce02694df8a32e9026e654';

const req = {
  params: {
    id: personId,
  },
};

beforeAll(async () => {
  await Person.create({
    _id: personId,
    name: 'The Person',
    gender: PERSON_GENDER.FEMALE,
  });
});

const expectedResponse = {
  person: {
    id: personId,
    children: [],
    citations: [],
    links: [],
    name: 'The Person',
    parents: [],
    siblings: [],
    spouses: [],
    shareLevel: 0,
    tags: [],
    treeParents: [],
    profileImage: null,
    gender: 'female',
  },
};

async function callRoute() {
  await getPersonRoute(req, res);
}

describe('getPersonRoute', () => {
  describe('when the person is found', () => {
    beforeEach(async () => {
      req.params.id = personId;
      await callRoute();
    });

    it('sends the response', async () => {
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe('when the person is not found', () => {
    beforeEach(async () => {
      req.params.id = '9f26466eb15c910cf66e0df8';
      await callRoute();
    });

    it('sends a 404 response', () => {
      expectResStatus(404);
    });
  });
});
