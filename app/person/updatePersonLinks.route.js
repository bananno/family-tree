import Person from './Person.model.js';

export default async function updatePersonLinksRoute(req, res) {
  const person = await Person.findById(req.params.id);

  if (!person) {
    return res.status(404).send('Person not found');
  }

  const action = req.body.action;
  const index = req.body.index;

  if (!['add', 'edit', 'delete', 'reorder'].includes(action)) {
    return res.status(400).send('Invalid action');
  }

  let newLinkValue;
  if (['add', 'edit'].includes(action)) {
    const url = req.body.url.trim();
    const text = req.body.text.trim();
    if (!url) {
      return res.status(400).send('URL is required');
    }
    newLinkValue = text ? `${url} ${text}` : url;
  }

  if (action !== 'add') {
    if (person.links[index] === undefined) {
      return res.status(400).send('Valid index is required');
    }
    if (action === 'reorder' && person.links[index - 1] === undefined) {
      return res.status(400).send('Valid index is required');
    }
  }

  if (action === 'delete') {
    person.links = [
      ...person.links.slice(0, index),
      ...person.links.slice(index + 1),
    ];
  } else if (action === 'edit') {
    person.links[index] = newLinkValue;
  } else if (action === 'reorder') {
    const tempLink = person.links[index];
    person.links[index] = person.links[index - 1];
    person.links[index - 1] = tempLink;
  } else {
    person.links.push(newLinkValue);
  }

  await person.save();

  res.send();
}
