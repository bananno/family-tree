// This file should be included by any file that tests database interactions
// in order to set up the mock database, but there is nothing to import.

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import '../app/models';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
