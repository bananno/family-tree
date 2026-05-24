import _ from 'lodash';

import Source, { MAIN_SOURCE_TYPES } from './Source.model.js';

export default async function listSourcesRoute(req, res) {
  const admin = req.session?.user?.admin;

  const allSources = await Source.find().populate('story');

  const viewableSources = admin
    ? allSources
    : allSources.filter(source => source.sharing && source.story.sharing);

  const sourceType = req.query.sourceType;
  const sources = await filterSourcesByType(sourceType, viewableSources);

  Source.sortByStory(sources);

  const items = sources.map(source => ({
    ..._.pick(source, ['id', 'title', 'location', 'date', 'useMarkdown']),
    story: _.pick(source.story, ['id', 'title', 'type']),
    sharing: source.sharing && source.story.sharing,
    filterText: getFilterText(source),
  }));

  res.json({ items });
}

////////////////////

async function filterSourcesByType(sourceType, sources) {
  if (!sourceType) {
    return sources;
  }

  if (sourceType === 'photo') {
    return sources.filter(source => source.story.title == 'Photo');
  }

  if (sourceType === 'other') {
    return sources.filter(source => {
      let storyType = source.story.type.toLowerCase();
      return (
        (source.story.title !== 'Photo' && storyType === 'other') ||
        !MAIN_SOURCE_TYPES.includes(storyType)
      );
    });
  }

  return sources.filter(
    source => source.story.type.toLowerCase() === sourceType,
  );
}

function getFilterText(source) {
  return [
    source.title,
    source.story.title,
    ...['city', 'region1', 'region2', 'country'].map(
      field => source.location[field],
    ),
    source.date.year,
  ]
    .filter(Boolean)
    .join('');
}
