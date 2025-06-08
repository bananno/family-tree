import _ from 'lodash';

import Notation from './Notation.model.js';

const truncateLength = 50;

export default async function listNotationsRoute(req, res) {
  const fullContent = req.query.fullContent;
  const notations = await Notation.find().populate('tags');

  const items = notations.map(notation => {
    const content =
      !fullContent && notation.text?.length >= truncateLength
        ? notation.text.slice(0, truncateLength - 3) + '...'
        : notation.text;

    return {
      ..._.pick(notation, ['id', 'title', 'sharing']),
      category: getCategory(notation),
      tags: mapTags(notation.tags, notation.tagValues),
      filterText: [notation.title, content].join(' '),
      content,
    };
  });

  res.send({ items });
}

////////////////////

// Legacy stuff, rethink this later.
function getCategory(notation) {
  const tagTitles = notation.tags.map(tag => tag.title);

  if (
    notation.title == 'profile summary' ||
    tagTitles.includes('profile summary') ||
    tagTitles.includes('research notes') ||
    tagTitles.includes('brick wall') ||
    tagTitles.includes('broken brick wall')
  ) {
    return 'person notes';
  }

  if (['source citation', 'checklist'].includes(notation.title)) {
    return notation.title;
  }

  if (notation.title == 'excerpt') {
    return 'source excerpt';
  }

  if (
    notation.title == 'featured quote' ||
    tagTitles.includes('featured quote')
  ) {
    return 'other tasks';
  }

  return '';
}

function mapTags(tags, tagValues) {
  return tags.map((tag, index) => ({
    id: tag.id,
    title: tag.title,
    value: tagValues[index] || '',
  }));
}
