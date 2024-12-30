import mongoose from 'mongoose';

import resources from '../resources.js';
import createModel from '../tools/createModel.js';

const resource = resources.find(resource => resource.name === 'image');

createModel(resource);

const Image = mongoose.model('Image');

export default Image;
