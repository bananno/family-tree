import Person from './Person.model.js';

export default async function updatePersonTagsRoute(req, res) {
  const person = await Person.findById(req.params.id);

  if (!person) {
    return res.status(404).send('Person not found');
  }

  const action = req.body.action;
  const index = req.body.index;

  if (!['delete', 'reorder'].includes(action)) {
    return res.status(400).send('Invalid action');
  }

  if (action !== 'add') {
    if (person.tags[index] === undefined) {
      return res.status(400).send('Valid index is required');
    }
    if (action === 'reorder' && person.tags[index - 1] === undefined) {
      return res.status(400).send('Valid index is required');
    }
  }

  if (action === 'delete') {
    person.tags = [
      ...person.tags.slice(0, index),
      ...person.tags.slice(index + 1),
    ];
    person.tagValues = [
      ...person.tagValues.slice(0, index),
      ...person.tagValues.slice(index + 1),
    ];
  } else if (action === 'reorder') {
    const tempTag = person.tags[index];
    const tempTagValue = person.tagValues[index];

    person.tags[index] = person.tags[index - 1];
    person.tags[index - 1] = tempTag;

    person.tagValues[index] = person.tagValues[index - 1];
    person.tagValues[index - 1] = tempTagValue;
  }

  await person.save();

  res.send();
}
