import mongoose from 'mongoose';

import tools from '../tools/modelTools.js';
import { mainStoryTypes } from './constants.js';

const methods = {};

methods.getAllSortedByTitle = async () => {
  const Story = mongoose.model('Story');
  const stories = await Story.find();
  stories.sort((a, b) => a.title < b.title ? -1 : 1);
  return stories;
};

// Given list of stories, return a list of all their entry sources.
methods.getAllEntries = async function(stories) {
  let entries = [];
  for (let i in stories) {
    const nextEntries = await stories[i].getEntries();
    entries = entries.concat(nextEntries);
  }
  return entries;
};

// Return a list of stories with given type.
// TO DO: sort stories by sub-type; pull logic from views/story/index.ejs
methods.getAllByType = async type => {
  const Story = mongoose.model('Story');

  if (!type) {
    return await Story.find({}).populate('tags');
  }

  if (type == 'other') {
    return await Story
      .find({type: { $nin: mainStoryTypes }})
      .populate('tags');
  }

  return await Story.find({type}).populate('tags');
};

// Get a list of all stories that have non-entry sources (that is,
// the sources belong to one story and are pinned to another story).
methods.getWithNonEntrySources = async () => {
  const allSources = await mongoose.model('Source')
    .find({'stories.0': {'$exists': true}})
    .populate('story')
    .populate('stories');

  allSources.forEach(source => {
    source.populateFullTitle();
  });

  const stories = [];
  const sourcesByStory = {};

  allSources.forEach(source => {
    source.stories.forEach(story => {
      const id = String(story._id);
      if (!sourcesByStory[id]) {
        stories.push(story);
        sourcesByStory[id] = story;
        story.sources = [];
      }
      story.sources.push(source);
    });
  });

  return stories;
};

// Given an item, get the list of stories that are available to be attached
// to that item to populate dropdown on edit table.
methods.getAvailableForItem = async function(item, fieldName) {
  const Story = mongoose.model('Story');
  const alreadyInList = item[fieldName || 'stories'] || [];
  const stories = await Story.find({_id: {$nin: alreadyInList}});
  Story.sortByTitle(stories);
  return stories;
};

methods.getAllSharedData = async (imageMap) => {
  const stories = await mongoose.model('Story').find({sharing: true})
    .populate('people').populate('tags');

  return stories.map(story => story.toSharedObject({imageMap}));
};

// Return a list of stories with "Census USA ___" title.
methods.getAllCensusUSA = async function() {
  return await mongoose.model('Story')
    .find({title: {$regex: 'Census USA.*'}});
};

methods.getFormDataNew = req => {
  const storyType = req.body.type.trim();
  const storyTitle = req.body.title.trim();

  if (storyType === '' || storyTitle === '') {
    return false;
  }

  const newStory = {
    type: storyType,
    title: storyTitle,
    date: req.getFormDataDate(),
    location: req.getFormDataLocation(),
  };

  if (storyType === 'other') {
    newStory.type = req.body['type-text'].trim();
  }

  return newStory;
};

methods.sortByTitle = function(stories) {
  tools.sortBy(stories, story => story.title);
};

// Sort by type, then title.
methods.sortByTypeTitle = function(stories) {
  tools.sortBy(stories, story => story.type + story.title);
};

export default methods;
