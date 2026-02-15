import NotationModel from './Notation.model.js';

const populateAvatarUrl = {
  path: 'avatar',
  select: 'file',
  populate: { path: 'file', select: 'key' },
};

export default async function getNotationRoute(req, res) {
  const notation = await NotationModel.findBySafeId(req.params.id)
    .populate({ path: 'people', populate: populateAvatarUrl })
    .populate(['stories', 'tags']);

  if (!notation) {
    return res.status(404).send({ message: 'Notation not found' });
  }

  const data = {
    id: notation._id,
    title: notation.title,
    sharing: notation.sharing,
    text: notation.text,
    people: notation.people.map(person => person.toListApi()),
    stories: notation.stories.map(story => ({
      id: story._id,
      title: story.title,
    })),
    tags: notation.convertTags({ asList: true }),
  };

  res.send(data);
}
