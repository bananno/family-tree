import Event from '../event/Event.model.js';
import Image from '../image/Image.model.js';
import Notation from '../notation/Notation.model.js';
import Person from '../person/Person.model.js';
import Source from '../source/Source.model.js';
import Story from '../story/Story.model.js';
import Tag from './Tag.model.js';

const MODELS_WITH_TAGS = [Event, Image, Notation, Person, Source, Story, Tag];

export default MODELS_WITH_TAGS;
