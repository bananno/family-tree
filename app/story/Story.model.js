import mongoose from 'mongoose';

import resources from '../resources.js';
import createModel from '../tools/createModel.js';

const resource = resources.find(resource => resource.name === 'story');

createModel(resource);

const Story = mongoose.model('Story');

export default Story;
