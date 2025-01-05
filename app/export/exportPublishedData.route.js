import fs from 'fs';
import mongoose from 'mongoose';

export default async function exportPublishedDataRoute(req, res) {
  const data = await getSharedData();

  if (!fs.existsSync('client/db')) {
    fs.mkdirSync('client/db');
  }

  await Promise.all([
    savePublishedDataFile('citations', data.citations),
    savePublishedDataFile('countries', data.countryList),
    savePublishedDataFile('events', data.events),
    savePublishedDataFile('featuredQuotes', data.featuredQuotes),
    savePublishedDataFile('notations', data.notations),
    savePublishedDataFile('people', data.people),
    savePublishedDataFile('sources', data.sources),
    savePublishedDataFile('stories', data.stories),
  ]);

  res.send();
}

async function getSharedData() {
  const data = {};

  const Citation = mongoose.model('Citation');
  const Event = mongoose.model('Event');
  const FeaturedQuote = mongoose.model('FeaturedQuote');
  const Image = mongoose.model('Image');
  const Notation = mongoose.model('Notation');
  const Person = mongoose.model('Person');
  const Source = mongoose.model('Source');
  const Story = mongoose.model('Story');

  const images = await Image.find({}).populate('tags');
  const imageMap = {};
  images.forEach(image => imageMap[image._id] = image);

  data.citations = await Citation.getAllSharedData();
  data.events = await Event.getAllSharedData();
  data.featuredQuotes = await FeaturedQuote.getAllSharedData();
  data.notations = await Notation.getAllSharedData();
  data.people = await Person.getAllSharedData();
  data.stories = await Story.getAllSharedData(imageMap);
  data.sources = await Source.getAllSharedData(imageMap);
  data.countryList = Person.getAllCountriesOfOrigin(data.people);

  return data;
}

function savePublishedDataFile(attr, arr) {
  const filename = `client/db/${attr}.json`;
  const stringifiedItems = arr.map(item => JSON.stringify(item));
  const content = `[\n  ${stringifiedItems.join(',\n  ')}\n]\n`;

  // fs.writeFile does not return a promise
  return new Promise(resolve => {
    fs.writeFile(filename, content, resolve);
  });
}
