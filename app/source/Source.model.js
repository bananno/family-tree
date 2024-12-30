import mongoose from 'mongoose';

import resources from '../resources.js';
import createModel from '../tools/createModel.js';

const resource = resources.find(resource => resource.name === 'source');

createModel(resource);

const Source = mongoose.model('Source');

export default Source;
