import '../testDb.js';
import { expectResStatus, res } from '../testTools.js';

import getPersonRoute from '../../app/person/getPerson.route.js';
import Person, { PERSON_GENDER } from '../../app/person/Person.model.js';

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
    profileImage: 'https://example.com/image.jpg',
    links: [
      'https://ancestry.com/123 Ancestry',
      'https://random.com',
    ],
  });
});

const expectedResponse = {
  person: {
    id: personId,
    children: [],
    citations: [],
    links: [
      { url: 'https://ancestry.com/123', text: 'Ancestry' },
      { url: 'https://random.com', text: 'https://random.com' },
    ],
    name: 'The Person',
    parents: [],
    siblings: expect.anything(),
    spouses: [],
    shareLevel: 0,
    tags: [],
    treeParents: [],
    avatarUrl: 'https://example.com/image.jpg',
    gender: 'female',
    birth: null,
    death: null,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    living: false,
    profileSummary: '',
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
