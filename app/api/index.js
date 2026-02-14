import { Notation } from '../import.js';

export default function createRoutes(router) {
  router.get('/api/notation-profile/:id', notationProfile);
}

async function notationProfile(req, res) {
  const notation = await Notation
    .findById(req.params.id)
    .populate('people')
    .populate('stories')
    .populate('tags');
  const data = {
    id: notation._id,
    title: notation.title,
    sharing: notation.sharing,
    text: notation.text,
    people: mapPeopleToNameAndId(notation.people),
    stories: notation.stories.map(story => ({id: story._id, title: story.title})),
    tags: notation.convertTags({asList: true}),
  };
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send({data});
}

////////////////////

function mapPeopleToNameAndId(people) {
  return people.map(person => ({id: person._id, name: person.name}));
}
