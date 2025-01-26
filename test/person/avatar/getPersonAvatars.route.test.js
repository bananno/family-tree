import '../../testDb.js';
import { expectResStatus, res } from '../../testTools.js';

import getPersonAvatarsRoute from '../../../app/person/avatar/getPersonAvatars.route.js';

import Person from '../../../app/person/Person.model.js';
import PersonAvatar from '../../../app/person/avatar/PersonAvatar.model.js';
import UploadedFile from '../../../app/file/UploadedFile.model.js';

const personId = '5bce02694df8a32e9026e654';
const fileId1 = 'a32e995bce0264df8026e654';
const fileId2 = 'f8a35b9026e65e0269c2e4d4';

const req = {
  params: {
    id: personId,
  },
};

let expectedResponse;

beforeAll(async () => {
  const mainPerson = new Person({
    _id: personId,
    name: 'The Person',
  });

  const uploadedFile1 = new UploadedFile({
    _id: fileId1,
    key: 'file1.jpg',
    fileType: 'image',
  });

  const uploadedFile2 = new UploadedFile({
    _id: fileId2,
    key: 'file2.jpg',
    fileType: 'image',
  });

  const avatar1 = new PersonAvatar({
    person: personId,
    file: fileId1,
    selected: true,
  });

  const avatar2 = new PersonAvatar({
    person: personId,
    file: fileId2,
  });

  await Promise.all([
    mainPerson.save(),
    uploadedFile1.save(),
    uploadedFile2.save(),
    avatar1.save(),
  ]);

  // It's newer, so let it save after the others.
  await avatar2.save();

  expectedResponse = [
    expect.objectContaining({
      id: avatar2.id,
      selected: false,
    }),
    expect.objectContaining({
      id: avatar1.id,
      selected: true,
    }),
  ];
});

async function callRoute() {
  await getPersonAvatarsRoute(req, res);
}

describe('getPersonAvatarsRoute', () => {
  describe('when the person is found', () => {
    beforeEach(async () => {
      req.params.id = personId;
      await callRoute();
    });

    it('sends the response', () => {
      expect(res.json).toHaveBeenCalledWith({ data: expectedResponse });
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
