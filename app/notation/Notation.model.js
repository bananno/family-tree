import mongoose from 'mongoose';

import resources from '../resources.js';
import createModel from '../tools/createModel.js';

const resource = resources.find(resource => resource.name === 'notation');

createModel(resource);

const Notation = mongoose.model('Notation');

export default Notation;
