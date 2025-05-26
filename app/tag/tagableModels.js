import Event from '../event/Event.model.js';
import Image from '../image/Image.model.js';
import Notation from '../notation/Notation.model.js';
import Person from '../person/Person.model.js';
import Source from '../source/Source.model.js';
import Story from '../story/Story.model.js';
import Tag from './Tag.model.js';

// export const TAGABLE_MODELS = [Event, Image, Notation, Person, Source, Story, Tag];

const TAGABLE_MODELS = [
  { name: 'Event', plural: 'events' },
  { name: 'Image', plural: 'images' },
  { name: 'Notation', plural: 'notations' },
  { name: 'Person', plural: 'people' },
  { name: 'Source', plural: 'sources' },
  { name: 'Story', plural: 'stories' },
  { name: 'Tag', plural: 'tags' },
];

export default TAGABLE_MODELS;
