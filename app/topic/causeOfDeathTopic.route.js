import Person from '../person/Person.model.js';
import Tag from '../tag/Tag.model.js';

// TODO: replace tags with real db columns somewhere.
export default async function causeOfDeathTopicRoute(req, res) {
  const admin = req.session?.user?.admin;

  const causeOfDeathTag = await Tag.findOne({
    title: { $regex: /^cause of death$/i },
  });

  const causeOfDeathNoteTag = await Tag.findOne({
    title: { $regex: /^cause of death note$/i },
  });

  const diedYoungTag = await Tag.findOne({
    title: { $regex: /^died young$/i },
  });

  const shareFilter = admin ? {} : { shareLevel: 2 };
  const selectFields = 'name tags tagValues shareLevel avatar gender';

  const causeOfDeathPeople = await Person.find({
    tags: causeOfDeathTag._id,
    ...shareFilter,
  })
    .select(selectFields)
    .populateAvatar();

  const diedYoungPeople = await Person.find({
    tags: diedYoungTag._id,
    ...shareFilter,
  })
    .select(selectFields)
    .populateAvatar();

  const mapPerson = person => ({
    ...person.toListApi(),
    tagValue: person.getTagValue(causeOfDeathTag),
    note: person.getTagValue(causeOfDeathNoteTag),
  });

  res.send({
    causeOfDeath: causeOfDeathPeople.map(mapPerson).filter(Boolean),
    diedYoung: diedYoungPeople.map(p => p.toListApi()).filter(Boolean),
  });
}
