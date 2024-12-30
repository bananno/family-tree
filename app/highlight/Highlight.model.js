import mongoose from 'mongoose';

import resources from '../resources.js';
import createModel from '../tools/createModel.js';

const resource = resources.find(resource => resource.name === 'highlight');

createModel(resource);

const Highlight = mongoose.model('Highlight');

export default Highlight;
