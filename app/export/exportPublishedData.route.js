import fs from 'fs';
import mongoose from 'mongoose';

export default async function exportPublishedDataRoute(req, res) {
  const data = await getSharedData();

  if (!fs.existsSync('client/db')) {
    fs.mkdirSync('client/db');
  }

  await Promise.all([
    savePublishedDataFile('people', data.people),
    savePublishedDataFile('stories', data.stories),
    savePublishedDataFile('sources', data.sources),
    savePublishedDataFile('events', data.events),
    savePublishedDataFile('citations', data.citations),
    savePublishedDataFile('notations', data.notations),
    savePublishedDataFile('countries', data.countryList),
  ]);

  res.send();
}

async function getSharedData() {
  const data = {};

  const Citation = mongoose.model('Citation');
  const Event = mongoose.model('Event');
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
