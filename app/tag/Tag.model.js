import mongoose from 'mongoose';

import resources from '../resources.js';
import createModel from '../tools/createModel.js';

const resource = resources.find(resource => resource.name === 'tag');

createModel(resource);

const Tag = mongoose.model('Tag');

export default Tag;
