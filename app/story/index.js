import mongoose from 'mongoose';

import { createController, getEditTableRows } from '../import.js';

import { mainStoryTypes } from './constants.js';
import storyChecklist from './checklist.js';
import * as storyTools from './tools.js';

const Notation = mongoose.model('Notation');
const Story = mongoose.model('Story');

export default function createRoutes(router) {
  router.use(storyTools.createRenderStory);

  createController({
    Model: Story,
    modelName: 'story',
    modelNamePlural: 'stories',
    router: router,
    routes: {
      index: storyIndex,
      create: createStory,
      show: storyShowMain,
      edit: storyEdit,
      other: {
        entries: storyEntries,
        newEntry: storyNewEntry,
        notations: storyNotations,
        checklist: storyChecklist,
        mentions: storyHighlightMentions,
      },
    },
  });

  router.post('/story/:id/createNotation', createStoryNotation);
  router.get('/stories/with-sources', storiesWithSources);
  router.get('/stories/:type', storyIndex);
  router.get('/story/:id/entries/region1/:region1', storyEntries);
}

////////////////////

async function storyIndex(req, res) {
  const storyType = req.params.type;
  const stories = await Story.getAllByType(storyType);

  Story.sortByTypeTitle(stories);

  res.render('story/index', {
    title: 'Stories',
    stories,
    subview: storyType,
    mainStoryTypes: [...mainStoryTypes, 'other'],
  });
}

async function createStory(req, res) {
  const newStory = Story.getFormDataNew(req);

  if (!newStory) {
    return res.send('error');
  }

  const story = await Story.create(newStory);
  res.redirect(`/story/${story._id}/edit`);
}

async function createStoryNotation(req, res) {
  const storyId = req.params.id;
  const newNotation = Notation.getFormDataNew(req);
  newNotation.stories.push(storyId);
  await Notation.create(newNotation);
  res.redirect('/story/' + storyId + '/notations');
}

async function storyShowMain(req, res) {
  req.story = await Story.findById(req.params.id)
    .populate('people')
    .populate('images')
    .populate('tags');
  await req.story.populateCiteText();
  await req.story.populateNonEntrySources();
  const data = await storyTools.getShowStoryInfo(req.story);
  res.renderStory('show', data);
}

async function storyEdit(req, res) {
  req.story = await Story.findById(req.params.id)
    .populate('people')
    .populate('images')
    .populate('tags');

  req.rootPath = '/story/' + req.story._id;

  const tableRows = await getEditTableRows({
    item: req.story,
    rootPath: req.rootPath,
  });

  res.renderStory('edit', {
    itemName: 'story',
    tableRows,
  });
}

async function storyEntries(req, res) {
  req.story = await Story.findById(req.params.id).populate('tags');
  req.rootPath = '/story/' + req.story._id;
  await req.story.populateEntries({populateImages: true});
  req.story.entries.sort((a, b) => a.title < b.title ? -1 : 1);
  let placeList;
  const region1 = req.params.region1;

  if (req.story.title.match('Census USA 1880') || region1) {
    const places = {};

    req.story.entries.forEach(source => {
      const state = source.location ? source.location.region1 : undefined;
      places[state] = true;
    });
    const regionNameList = Object.keys(places).sort();
    const entriesUrl = req.rootPath + '/entries';

    placeList = [
      [entriesUrl, 'all'],
      ...regionNameList.map(place => [entriesUrl + '/region1/' + place, place])
    ];

    // Can't filter these out in the original Source.find() because need to know
    // the list of places.
    if (region1) {
      req.story.entries = req.story.entries.filter(source =>
        source.location && source.location.region1 === region1
      );
    }
  }

  res.renderStory('entries', {placeList});
}

async function storyNewEntry(req, res) {
  req.story = await Story.findById(req.params.id).populate('tags');
  res.renderStory('newEntry', {actionPath: '/sources/new'});
}

async function storyNotations(req, res) {
  req.story = await Story.findById(req.params.id).populate('tags');
  await req.story.populateNotations();

  const notations = {};

  req.story.notations.forEach(notation => {
    const category = notation.getCategoryForStory();
    notations[category] = (notations[category] || []).concat(notation);
  });

  res.renderStory('notations', {notations});
}

async function storyHighlightMentions(req, res) {
  req.story = await Story.findById(req.params.id);
  await req.story.populateHighlightMentions();
  res.renderStory('mentions');
}

async function storiesWithSources(req, res) {
  const stories = await Story.getWithNonEntrySources();

  res.render('story/withSources', {
    title: 'Stories with Sources',
    stories,
  });
}
