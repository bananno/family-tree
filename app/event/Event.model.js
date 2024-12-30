import mongoose from 'mongoose';

import resources from '../resources.js';
import createModel from '../tools/createModel.js';

const resource = resources.find(resource => resource.name === 'event');

createModel(resource);

const Event = mongoose.model('Event');

export default Event;
