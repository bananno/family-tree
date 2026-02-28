import Person from './Person.model.js';

const INVERSE = {
  parents: 'children',
  spouses: 'spouses',
  children: 'parents',
};

export default async function updatePersonRelationshipsRoute(req, res) {
  const person = await Person.findById(req.params.id);

  if (!person) {
    return res.status(404).send('Person not found');
  }

  const { action, relationship, relativeId, index } = req.body;

  if (!['add', 'delete', 'reorder'].includes(action)) {
    return res.status(400).send('Invalid action');
  }

  if (!['parents', 'spouses', 'children'].includes(relationship)) {
    return res.status(400).send('Invalid relationship');
  }

  if (action === 'reorder') {
    const success = await reorderRelative(person, relationship, index);
    if (!success) {
      return res.status(400).send('Valid index is required');
    }
    return res.send();
  }

  if (!relativeId) {
    return res.status(400).send('relativeId is required');
  }

  const relative = await Person.findById(relativeId);

  if (!relative) {
    return res.status(404).send('Relative not found');
  }

  if (action === 'add') {
    await attachRelative(person, relationship, relative);
  } else {
    await detachRelative(person, relationship, relative);
  }

  res.send();
}

////////////////////

async function attachRelative(person, relationship, relative) {
  person[relationship].push(relative);
  relative[INVERSE[relationship]].push(person);

  await person.save();
  await relative.save();
}

async function detachRelative(person, relationship, relative) {
  person[relationship] = removeById(person[relationship], relative.id);
  relative[INVERSE[relationship]] = removeById(
    relative[INVERSE[relationship]],
    person.id,
  );

  await person.save();
  await relative.save();
}

async function reorderRelative(person, relationship, index) {
  const list = person[relationship];

  if (index == null || index < 1 || index >= list.length) {
    return false;
  }

  const temp = list[index];
  list[index] = list[index - 1];
  list[index - 1] = temp;

  await person.save();
  return true;
}

function removeById(list, id) {
  return list.filter(item => String(item._id || item) !== String(id));
}
