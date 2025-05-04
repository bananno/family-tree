import fs from 'fs';
import mongoose from 'mongoose';

export default async function exportFullDataRoute(req, res) {
  await Promise.all([
    exportAllModelRecords('Citation', 'citations'),
    exportAllModelRecords('Event', 'events'),
    exportAllModelRecords('FeaturedQuote', 'featuredQuotes'),
    exportAllModelRecords('Highlight', 'highlights'),
    exportAllModelRecords('Image', 'images'),
    exportAllModelRecords('Notation', 'notations'),
    exportAllModelRecords('Person', 'people'),
    exportAllModelRecords('PersonAvatar', 'personAvatars'),
    exportAllModelRecords('Source', 'sources'),
    exportAllModelRecords('Story', 'stories'),
    exportAllModelRecords('Tag', 'tags'),
    exportAllModelRecords('UploadedFile', 'uploadedFiles'),
  ]);

  res.send();
}

////////////////////

async function exportAllModelRecords(modelName, itemName) {
  const Model = mongoose.model(modelName);

  // lean() returns plain javascript objects instead of Mongoose documents
  const itemData = await Model.find().lean();

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
