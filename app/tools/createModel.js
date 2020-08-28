const mongoose = require('mongoose');
const tools = require('./modelTools');

module.exports = createModel;

function createModel(modelName) {
  const dir = '../' + modelName.toLowerCase() + '/';

  const modelProperties = require(dir + 'model-schema');
  const instanceMethods = require(dir + 'model-instance');
  const staticMethods = require(dir + 'model-static');

  const modelSchema = {};

  modelProperties.forEach(prop => {
    if (prop.includeInSchema === false) {
      return;
    }

    if (prop.specialType) {
      if (prop.specialType === 'date') {
        modelSchema[prop.name] = tools.dateStructure;
        return;
      }

      if (prop.specialType === 'location') {
        modelSchema[prop.name] = tools.locationStructure;
        return;
      }

      if (prop.specialType === 'tags') {
        modelSchema.tags = [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}];
        modelSchema.tagValues = [String];
        return;
      }
    }

    const spec = {};

    if (prop.references) {
      spec.type = mongoose.Schema.Types.ObjectId;
      spec.ref = prop.references;
    } else {
      spec.type = prop.type;
    }

    if (prop.defaultValue) {
      spec.default = prop.defaultValue;
    }

    modelSchema[prop.name] = prop.isArray ? [spec] : spec;
  });

  const citationSchema = new mongoose.Schema(modelSchema);

  for (let methodName in instanceMethods) {
    citationSchema.methods[methodName] = instanceMethods[methodName];
  }

  for (let methodName in staticMethods) {
    citationSchema.statics[methodName] = staticMethods[methodName];
  }

  mongoose.model(modelName, citationSchema);
}
