import '../testDb.js';
import { res } from '../testTools.js';

import updatePersonLinksRoute from '../../app/person/updatePersonLinks.route.js';
import Person from '../../app/person/Person.model.js';

const personId = '5bce02694df8a32e9026e654';

const req = { params: { id: personId }, body: {} };

async function callRoute() {
  await updatePersonLinksRoute(req, res);
}

describe('updatePersonLinksRoute', () => {
  beforeEach(async () => {
    await Person.deleteMany();
    await Person.create({
      _id: personId,
      links: [
        'https://www.ancestry.com/456 Ancestry',
        'https://www.familysearch.org/789 FamilySearch',
        'https://www.example.com/123 Example',
      ],
    });
  });

  describe('when person is not found', () => {
    beforeEach(async () => {
      req.params.id = 'df8a396e65442e9025bce026';
      await callRoute();
    });

    afterEach(() => {
      req.params.id = personId;
    });

    it('returns a 404 status', () => {
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('when action is "add"', () => {
    beforeEach(async () => {
      req.body = {
        action: 'add',
        url: 'https://www.findagrave.com/123456',
        text: 'FindAGrave',
      };
    });

    describe('when the body contains url and text', () => {
      beforeEach(async () => {
        await callRoute();
      });

      it('adds the link', async () => {
        const person = await Person.findById(personId);
        expect(person.links).toEqual([
          'https://www.ancestry.com/456 Ancestry',
          'https://www.familysearch.org/789 FamilySearch',
          'https://www.example.com/123 Example',
          'https://www.findagrave.com/123456 FindAGrave',
        ]);
      });
    });

    describe('when url is missing', () => {
      beforeEach(async () => {
        req.body.url = ' ';
        await callRoute();
      });

      it('returns a 400 status', () => {
        expect(res.status).toHaveBeenCalledWith(400);
      });
    });

    describe('when text is missing', () => {
      beforeEach(async () => {
        req.body.text = '';
        await callRoute();
      });

      it('adds the link without text', async () => {
        const person = await Person.findById(personId);
        expect(person.links).toEqual([
          'https://www.ancestry.com/456 Ancestry',
          'https://www.familysearch.org/789 FamilySearch',
          'https://www.example.com/123 Example',
          'https://www.findagrave.com/123456',
        ]);
      });
    });
  });

  describe('when action is "edit"', () => {
    beforeEach(async () => {
      req.body = {
        action: 'edit',
        index: 1,
        url: 'https://www.familysearch.org/789/updated',
        text: 'FamilySearchUpdated',
      };
    });

    describe('when the body contains url and text', () => {
      beforeEach(async () => {
        await callRoute();
      });

      it('updates the link', async () => {
        const person = await Person.findById(personId);
        expect(person.links).toEqual([
          'https://www.ancestry.com/456 Ancestry',
          'https://www.familysearch.org/789/updated FamilySearchUpdated',
          'https://www.example.com/123 Example',
        ]);
      });
    });

    describe('when url is missing', () => {
      beforeEach(async () => {
        req.body.url = ' ';
        await callRoute();
      });

      it('returns a 400 status', () => {
        expect(res.status).toHaveBeenCalledWith(400);
      });
    });

    describe('when text is missing', () => {
      beforeEach(async () => {
        req.body.text = '';
        await callRoute();
      });

      it('updates the link without text', async () => {
        const person = await Person.findById(personId);
        expect(person.links).toEqual([
          'https://www.ancestry.com/456 Ancestry',
          'https://www.familysearch.org/789/updated',
          'https://www.example.com/123 Example',
        ]);
      });
    });

    describe('when the index is 0', () => {
      beforeEach(async () => {
        req.body = {
          action: 'edit',
          index: 0,
          url: 'https://www.ancestry.com/456/updated',
          text: 'AncestryUpdated',
        };
        await callRoute();
      });

      it('updates the link', async () => {
        const person = await Person.findById(personId);
        expect(person.links).toEqual([
          'https://www.ancestry.com/456/updated AncestryUpdated',
          'https://www.familysearch.org/789 FamilySearch',
          'https://www.example.com/123 Example',
        ]);
      });
    });

    describe('when the index is invalid', () => {
      beforeEach(async () => {
        req.body.index = 33;
        await callRoute();
      });

      it('returns a 400 status', () => {
        expect(res.status).toHaveBeenCalledWith(400);
      });
    });
  });

  describe('when action is "delete"', () => {
    beforeEach(async () => {
      req.body = {
        action: 'delete',
        index: 1,
      };
    });

    describe('when the index is 0', () => {
      beforeEach(async () => {
        req.body.index = 0;
        await callRoute();
      });

      it('deletes the link', async () => {
        const person = await Person.findById(personId);
        expect(person.links).toEqual([
          'https://www.familysearch.org/789 FamilySearch',
          'https://www.example.com/123 Example',
        ]);
      });
    });

    describe('when the index is greater than 0', () => {
      beforeEach(async () => {
        req.body.index = 2;
        await callRoute();
      });

      it('deletes the link', async () => {
        const person = await Person.findById(personId);
        expect(person.links).toEqual([
          'https://www.ancestry.com/456 Ancestry',
          'https://www.familysearch.org/789 FamilySearch',
        ]);
      });
    });

    describe('when there is only one link in the list', () => {
      beforeEach(async () => {
        await Person.updateOne(
          {},
          { links: ['https://www.familysearch.org/789 FamilySearch'] },
        );
        req.body.index = 0;
        await callRoute();
      });

      it('deletes the link', async () => {
        const person = await Person.findById(personId);
        expect(person.links).toEqual([]);
      });
    });

    describe('when the index is invalid', () => {
      beforeEach(async () => {
        req.body.index = 33;
        await callRoute();
      });

      it('returns a 400 status', () => {
        expect(res.status).toHaveBeenCalledWith(400);
      });
    });
  });

  describe('when action is "reorder"', () => {
    beforeEach(async () => {
      req.body = {
        action: 'reorder',
        index: 1,
      };
    });

    describe('when the index is more than 0', () => {
      beforeEach(async () => {
        req.body.index = 2;
        await callRoute();
      });

      it('reorders the links', async () => {
        const person = await Person.findById(personId);
        expect(person.links).toEqual([
          'https://www.ancestry.com/456 Ancestry',
          'https://www.example.com/123 Example',
          'https://www.familysearch.org/789 FamilySearch',
        ]);
      });
    });

    describe('when the index is 0', () => {
      beforeEach(async () => {
        req.body.index = 0;
        await callRoute();
      });

      it('returns a 400 status', () => {
        expect(res.status).toHaveBeenCalledWith(400);
      });
    });

    describe('when the index is invalid', () => {
      beforeEach(async () => {
        req.body.index = 33;
        await callRoute();
      });

      it('returns a 400 status', () => {
        expect(res.status).toHaveBeenCalledWith(400);
      });
    });
  });

  describe('when the action is invalid', () => {
    beforeEach(async () => {
      req.body.action = 'other';
      await callRoute();
    });

    it('returns a 400 status', () => {
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
