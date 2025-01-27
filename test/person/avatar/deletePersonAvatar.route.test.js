import '../../testDb.js';
import { expectResStatus, res } from '../../testTools.js';

import deletePersonAvatarRoute from '../../../app/person/avatar/deletePersonAvatar.route.js';

import Person from '../../../app/person/Person.model.js';
import PersonAvatar from '../../../app/person/avatar/PersonAvatar.model.js';
import UploadedFile from '../../../app/file/UploadedFile.model.js';

import { deleteFileFromS3 } from '../../../app/tools/s3.js';

const personId = '5bce02694df8a32e9026e654';
const avatarId = '55bce02694df8a2e9026e653';
const fileId = '90265bc54df8a32ee0269e65';

const unrelatedAvatarId = '558a2bce09026e6532694dfe';

jest.mock('../../../app/tools/s3.js', () => {
  return {
    deleteFileFromS3: jest.fn(),
  };
});

deleteFileFromS3.mockResolvedValue();

const req = {
  params: {
    avatarId,
    id: personId,
  },
};

beforeAll(async () => {
  const person = new Person({ _id: personId, name: 'The Person' });
  const file = new UploadedFile({
    _id: fileId,
    key: 'file.png',
    fileType: 'image',
  });
  person.avatar = new PersonAvatar({ _id: avatarId, person, file });

  const otherPerson = new Person({ name: 'Other Person' });
  const unrelatedFile = new UploadedFile({
    key: 'unrelated.png',
    fileType: 'image',
  });
  otherPerson.avatar = new PersonAvatar({
    _id: unrelatedAvatarId,
    person: otherPerson,
    file: unrelatedFile,
  });

  await Promise.all([
    person.save(),
    file.save(),
    person.avatar.save(),
    otherPerson.save(),
    unrelatedFile.save(),
    otherPerson.avatar.save(),
  ]);
});

async function callRoute() {
  await deletePersonAvatarRoute(req, res);
}

describe('deletePersonAvatarRoute', () => {
  beforeEach(() => {
    req.params.avatarId = avatarId;
    req.params.id = personId;
  });

  describe('when the person and avatar are found', () => {
    it('deletes the file from S3', async () => {
      await callRoute();
      expect(deleteFileFromS3).toHaveBeenCalledWith({ Key: 'file.png' });
    });

    it('deletes the UploadedFile record', async () => {
      await callRoute();
      const file = await UploadedFile.findById(fileId);
      expect(file).toBeNull();
    });

    it('deletes the PersonAvatar record', async () => {
      await callRoute();
      const avatar = await PersonAvatar.findById(avatarId);
      expect(avatar).toBeNull();
    });

    describe('when the person has the avatar as their avatar', () => {
      it('removes the avatar from the person', async () => {
        await callRoute();
        const person = await Person.findById(personId);
        expect(person.avatar).toBeNull();
      });
    });

    describe('when the person has a different avatar', () => {
      const otherAvatarId = '558a2bce09026e6532694dfe';

      beforeEach(async () => {
        await Person.updateOne({ _id: personId }, { avatar: otherAvatarId });
        await callRoute();
      });

      afterEach(async () => {
        await Person.updateOne({ _id: personId }, { avatar: avatarId });
      });

      it('does not remove the avatar', async () => {
        const person = await Person.findById(personId);
        expect(person.avatar.toString()).toBe(otherAvatarId);
      });
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

  describe('when the avatar is not found', () => {
    beforeEach(async () => {
      req.params.avatarId = '9f26466eb15c910cf66e0df8';
      await callRoute();
    });

    it('sends a 404 response', () => {
      expectResStatus(404);
    });
  });

  describe('when the avatar does not belong to the person', () => {
    beforeEach(async () => {
      req.params.avatarId = unrelatedAvatarId;
      await callRoute();
    });

    it('sends a 404 response', () => {
      expectResStatus(404);
    });
  });
});
