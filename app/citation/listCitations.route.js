import _ from 'lodash';

import CitationModel from './Citation.model.js';
import PersonModel, { PERSON_SHARE_LEVEL } from '../person/Person.model.js';

export default async function listCitationsRoute(req, res) {
  const admin = req.session?.user?.admin;

  const citationQuery = {};

  if (req.query.personId) {
    const personQuery = { _id: req.query.personId };

    if (!admin) {
      personQuery.shareLevel = PERSON_SHARE_LEVEL.EVERYTHING;
    }

    console.log('personQuery', personQuery);

    const person = await PersonModel.findOne(personQuery).select('name');

    if (!person) {
      return res.status(404).send('Person not found');
    }

    console.log('found person', person.name);

    citationQuery.person = person.id;
  }

  if (req.query.sourceId) {
    // TODO
  }

  const citations = await CitationModel.find(citationQuery).populate({
    path: 'source',
    select: 'id title story',
    populate: {
      path: 'story',
      select: 'id title',
    },
  });

  CitationModel.sortByItem(citations);

  const items = citations.map(citation => {
    // Separate "birth - date" into "birth" and "date".
    const arr = citation.item.split(' - ');
    const itemPart1 = arr.shift();
    const itemPart2 = arr.join(' ');

    return {
      ..._.pick(citation, ['id', 'information']),
      information: citation.information,
      itemPart1,
      itemPart2,
      source: {
        id: citation.source.id,
        fullTitle: [citation.source.story.title, citation.source.title].join(
          ' - ',
        ),
      },
    };
  });

  res.send({ items });
}
