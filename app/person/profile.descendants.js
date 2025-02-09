import {
  Event,
  Notation,
  Person,
  sorting,
} from '../import.js';

export default async function personDescendants(req, res) {
  const monthNames = [
    null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const people = await Person.find().populate('tags');

  await Person.populateBirthAndDeath(people);

  const marriageEvents = await Event.find({title: {$in: ['divorce', 'marriage']}});
  const taglineNotations = await Notation.find({title: 'descendants chart tagline'});

  const generationLimit = req.params.generation ? parseInt(req.params.generation) : undefined;

  res.renderPersonProfile('descendants', {
    people,
    marriageEvents,
    findPersonInList: Person.findInList,
    getLifeDatesString,
    formatEventDate,
    sortBy: sorting.sortBy,
    generationLimit,
    taglineNotations,
  });

  function getLifeDatesString(person) {
    const livingStr = person.living ? 'living' : undefined;
    const items = [];
    if (person.isATwin()) {
      items.push('twin');
    }
    const lifeDates = [
      formatEventDate(person.birth) || '?',
      formatEventDate(person.death) || livingStr || '?',
    ].join('-');
    items.push(lifeDates);
    return items.join('; ');
  }

  function formatEventDate(event) {
    if (event && event.date) {
      if (event.date.display) {
        return event.date.display;
      }
      const {day, month, year} = event.date;
      return [monthNames[month], day, year].filter(Boolean).join(' ');
    }
  }
}
