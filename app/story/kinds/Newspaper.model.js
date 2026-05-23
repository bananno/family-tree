import mongoose from 'mongoose';

import Story from '../Story.model.js';

const newspaperSchema = new mongoose.Schema({
  // Newspaper-specific fields can be added here.
});

// A newspaper entry is an article that appeared in the newspaper.
newspaperSchema.methods.canHaveEntries = () => true;

// Newspapers do not have dates, but their entries (articles) do.
newspaperSchema.methods.canHaveDate = () => false;
newspaperSchema.methods.entriesCanHaveDate = () => true;

// The newspaper has a location (e.g. the city where it is published)
// but its entries do not.
newspaperSchema.methods.entriesCanHaveLocation = () => false;

const Newspaper = Story.discriminator(
  'Newspaper',
  newspaperSchema,
  'newspaper',
);

export default Newspaper;
