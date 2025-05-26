import Person from './Person.model.js';

const personGender = [null, 'female', 'male', 'unknown'];

export default async function updatePersonRoute(req, res) {
  try {
    const person = await Person.findById(req.params.id);

    if (!person) {
      return res.status(404).send('Person not found');
    }

    person.name = req.body.name;
    person.customId = req.body.customId;
    person.shareLevel = req.body.shareLevel;
    person.shareName = req.body.shareName;
    person.gender = personGender.indexOf(req.body.gender) || 0;
    person.living = req.body.living;

    await person.save();

    res.send();
  } catch (error) {
    return res.status(500).send('Internal server error');
  }
}
