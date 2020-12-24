const {
  Source,
  Story,
  Tag,
} = require('../import');

const constants = require('./constants');

module.exports = {
  summary: renderSummary,
  edit: renderEdit,
  other: {
    fastCitations: renderFastCitations,
    highlights: renderHighlights,
    notations: renderNotations,
  }
};

async function renderSummary(req, res) {
  req.source = await Source.findById(req.sourceId)
    .populate('story')
    .populate('stories')
    .populate('people')
    .populate('images')
    .populate('tags');

  await req.source.populateCiteText({storyFirst: true});
  await req.source.populateAndSortCitations();

  res.renderSource('show');
}

async function renderEdit(req, res) {
  req.source = await Source.findById(req.sourceId)
    .populate('story')
    .populate('stories')
    .populate('images')
    .populate('people')
    .populate('tags');

  const source = req.source;
  await source.populateCiteText({includeStory: false});

  const stories = await Story.find({});
  stories.sort((a, b) => a.title < b.title ? -1 : 1);

  await source.populateAndSortCitations();

  // allPeople - the dropdown for new notations.
  // unlinkedPeople - the dropdown for linking additional people to the source.
  const {allPeople, unlinkedPeople} = await source.getPeopleForDropdown();

  const tags = await Tag.find({});
  Tag.sortByTitle(tags);

  res.renderSource('edit', {
    title: 'Edit Source',
    fields: constants.fields,
    people: allPeople,
    unlinkedPeople,
    stories,
    needCitationText: source.story.title.match('Census')
      && source.citeText.length == 0,
    citationTextPath: '/source/' + source._id + '/createCitationNotation',
    tags,
  });
}

async function renderFastCitations(req, res) {
  req.source = await Source.findById(req.sourceId)
    .populate('story')
    .populate('people');

  await req.source.populateAndSortCitations();

  res.renderSource('fastCitations', {
    title: 'Edit Source',
    sourceCitationToDoList: req.source.getFastCitationToDoList(),
  });
}

async function renderHighlights(req, res) {
  req.source = await Source.findById(req.sourceId)
    .populate('story')
    .populate('people');

  await req.source.populateCitations();
  await req.source.populateAndProcessHighlights();

  const {allPeople} = await req.source.getPeopleForDropdown();

  res.renderSource('highlights', {allPeople});
}

async function renderNotations(req, res) {
  req.source = await Source.findById(req.sourceId).populate('story');

  await req.source.populateNotationsInCategories();

  res.renderSource('notations');
}
