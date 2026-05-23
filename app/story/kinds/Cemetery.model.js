import mongoose from 'mongoose';

import Story from '../Story.model.js';

const cemeterySchema = new mongoose.Schema({
  // Cemetery-specific fields can be added here.
});

// A cemetery entry approximately corresponds to a headstone,
// so multiple people can be associated with each entry.
cemeterySchema.methods.canHaveEntries = () => true;

// Cemeteries and their entries do not have dates.
cemeterySchema.methods.canHaveDate = () => false;
cemeterySchema.methods.entriesCanHaveDate = () => false;

// The cemetery has a location, but its entries do not.
cemeterySchema.methods.entriesCanHaveLocation = () => false;

const Cemetery = Story.discriminator('Cemetery', cemeterySchema, 'cemetery');

export default Cemetery;
