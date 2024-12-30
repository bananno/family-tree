import mongoose from 'mongoose';

import resources from '../resources.js';
import createModel from '../tools/createModel.js';

const resource = resources.find(resource => resource.name === 'citation');

createModel(resource);

const Citation = mongoose.model('Citation');

export default Citation;
