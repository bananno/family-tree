import fs from 'fs';
import mongoose from 'mongoose';

export default async function exportFullDataRoute(req, res) {
  const data = await getFullData();

  await Promise.all([
    saveFullDataFile(data, 'citations'),
    saveFullDataFile(data, 'events'),
    saveFullDataFile(data, 'featuredQuotes'),
    saveFullDataFile(data, 'highlights'),
    saveFullDataFile(data, 'images'),
    saveFullDataFile(data, 'notations'),
    saveFullDataFile(data, 'people'),
    saveFullDataFile(data, 'sources'),
    saveFullDataFile(data, 'stories'),
    saveFullDataFile(data, 'tags'),
  ]);

  res.send();
}

////////////////////

async function getFullData() {
  const data = {};

  const Citation = mongoose.model('Citation');
  const Event = mongoose.model('Event');
  const FeaturedQuote = mongoose.model('FeaturedQuote');
  const Highlight = mongoose.model('Highlight');
  const Image = mongoose.model('Image');
  const Notation = mongoose.model('Notation');
  const Person = mongoose.model('Person');
  const Source = mongoose.model('Source');
  const Story = mongoose.model('Story');
  const Tag = mongoose.model('Tag');

  data.citations = await Citation.find({});
  data.events = await Event.find({});
  data.featuredQuotes = await FeaturedQuote.find({});
  data.highlights = await Highlight.find({});
  data.images = await Image.find({});
  data.notations = await Notation.find({});
  data.people = await Person.find({});
  data.sources = await Source.find({});
  data.stories = await Story.find({});
  data.tags = await Tag.find({});

  return data;
}

function saveFullDataFile(data, itemName) {
  const itemData = data[itemName];
  const filename = `database-backup/database-${itemName}.json`;
  const content = stringifyData(itemData);

  // fs.writeFile does not return a promise
  return new Promise(resolve => {
    fs.writeFile(filename, content, resolve);
  });
}

function stringifyData(array) {
  return '[\n' + array.map(s => JSON.stringify(s)).join(',\n') + '\n]';
}
