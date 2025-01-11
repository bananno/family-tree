import _ from 'lodash';
import mongoose from 'mongoose';

const Source = mongoose.model('Source');
const Story = mongoose.model('Story');

// A "photo" is a weird mix of story/source/image. Need to rethink.
export default async function getPersonPhotos(req, res) {
  const personId = req.params.id;
  const photoStory = await Story.findOne({ title: 'Photo' });
  const sources = await Source.find({
    story: photoStory,
    people: personId,
  }).populate('images title date location people content');

  // A source may have multiple photos; a photo could appear in more than one source.
  const photos = sources.map(source =>
    source.images.map(image => ({
      id: `${source.id}-${image.id}`,
      url: image.url,
      people: source.people.map(person => person.toListApi()),
      ..._.pick(source, ['title', 'date', 'location', 'content']),
    }))
  ).flat();

  res.json({ photos });
}
