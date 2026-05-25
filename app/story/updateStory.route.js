import mongoose from 'mongoose';

import PersonModel from '../person/Person.model.js';
import StoryModel from './Story.model.js';

export default async function updateStoryRoute(req, res) {
  const story = await StoryModel.findById(req.params.id);

  if (!story) {
    return res.status(404).send();
  }

  if ('notes' in req.body) {
    story.notes = req.body.notes?.trim();
  }

  if ('notesMarkdown' in req.body) {
    story.notesMarkdown = String(req.body.notesMarkdown) === 'true';
  }

  if ('people' in req.body) {
    const peopleError = await getValidationErrorsForPersonIds(req.body.people);
    if (peopleError) {
      return res.status(400).send({ error: peopleError });
    }
    story.people = req.body.people;
  }

  if ('sharing' in req.body) {
    story.sharing = String(req.body.sharing) === 'true';
  }

  if ('summary' in req.body) {
    story.summary = req.body.summary?.trim();
  }

  if ('title' in req.body) {
    const title = req.body.title?.trim();
    if (!title) {
      return res.status(400).send({ error: 'title is required' });
    }
    story.title = title;
  }

  await story.save();

  res.send();
}

////////////////////

async function getValidationErrorsForPersonIds(personIds) {
  if (!Array.isArray(personIds)) {
    return 'people must be an array of person ids';
  }

  const allValidIds = personIds.every(id =>
    mongoose.Types.ObjectId.isValid(id),
  );
  if (!allValidIds) {
    return 'people must be an array of person ids';
  }

  const countPeople = await PersonModel.countDocuments({
    _id: { $in: personIds },
  });
  if (countPeople !== personIds.length) {
    return 'one or more person ids are duplicated or invalid';
  }

  return null;
}
