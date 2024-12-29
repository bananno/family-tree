import mongoose from 'mongoose';

import resources from '../resources.js';
import createModel from '../tools/createModel.js';

const resource = resources.find(resource => resource.name === 'person');

createModel(resource);

const Person = mongoose.model('Person');

export default Person;
