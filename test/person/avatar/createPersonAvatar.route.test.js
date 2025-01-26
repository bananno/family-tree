import '../../testDb.js';
import { expectResStatus, res } from '../../testTools.js';

import createPersonAvatarRoute from '../../../app/person/avatar/createPersonAvatar.route.js';

import Person from '../../../app/person/Person.model.js';
import PersonAvatar from '../../../app/person/avatar/PersonAvatar.model.js';
import UploadedFile from '../../../app/file/UploadedFile.model.js';

import { uploadFileToS3 } from '../../../app/tools/s3.js';

const personId = '5bce02694df8a32e9026e654';

jest.mock('../../../app/tools/s3.js', () => {
  return {
    uploadFileToS3: jest.fn(),
  };
});

uploadFileToS3.mockResolvedValue({ ETag: '123' });

const fileToUpload = {
  originalname: 'file.jpg',
  size: 11000,
  buffer: 'dummy-file-content',
  mimetype: 'image/jpeg',
};

const req = {
  params: {
    id: personId,
  },
  file: fileToUpload,
};

beforeAll(async () => {
  await Person.create({ _id: personId, name: 'The Person' });
});

async function callRoute() {
  await createPersonAvatarRoute(req, res);
}

describe('createPersonAvatarRoute', () => {
  describe('when the person is found', () => {
    let uploadedFile;

    beforeEach(async () => {
      req.params.id = personId;
      await Person.updateMany({}, { avatar: null });
      await callRoute();
      uploadedFile = await UploadedFile.findOne();
    });

    it('stores the original file data', async () => {
      expect(uploadedFile.fileType).toBe('image');
      expect(uploadedFile.mimeType).toBe('image/jpeg');
      expect(uploadedFile.size).toBe(11000);
    });

    it('generates the filename in the avatar directory', () => {
      expect(uploadedFile.key).toBe(`avatar/${uploadedFile.id}.jpg`);
    });

    it('uploads the file to S3', async () => {
      expect(uploadFileToS3).toHaveBeenCalledWith({
        Key: `avatar/${uploadedFile.id}.jpg`,
        Body: fileToUpload.buffer,
        ContentType: 'image/jpeg',
      });
    });

    it('creates a PersonAvatar record', async () => {
      const personAvatar = await PersonAvatar.findOne();
      expect(String(personAvatar.person._id)).toBe(personId);
      expect(String(personAvatar.file._id)).toBe(uploadedFile.id);
    });

    it('sets the avatar on the person with a usable url', async () => {
      const person = await Person.findById(personId).populate({
        path: 'avatar',
        populate: { path: 'file' },
      });

      // Example: https://treefile.annabidstrup.com/avatar/5bce02694df8a32e9026e654.jpg
      expect(person.avatar.file.url()).toMatch(
        /^https\:\/\/treefile\.annabidstrup\.com\/avatar\/[a-zA-Z0-9]{24}\.jpg$/,
      );
    });

    it('sends the response', () => {
      expect(res.send).toHaveBeenCalledWith();
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
