import mongoose from 'mongoose';

export default [
  {
    name: 'name',
    dataType: String,
  },
  {
    name: 'customId',
    dataType: String,
  },
  {
    name: 'shareLevel',
    dataType: Number,
    inputType: 'toggle',
    defaultValue: 0,
    valueNames: ['none (0)', 'restricted (1)', 'everything (2)'],
  },
  {
    name: 'shareName',
    dataType: String,
    isEditable: person => person.shareLevel === 1,
  },
  {
    // Just a detail; no need for a real "image" object.
    name: 'profileImage',
    dataType: String,
    isEditable: () => false,
  },
  {
    name: 'gender',
    dataType: Number,
    inputType: 'dropdown',
    valueNames: [null, 'female', 'male', 'unknown'], // (0 = not yet specified in database)
  },
  {
    name: 'living',
    dataType: Boolean,
    defaultValue: false,
  },
  {
    name: 'parents',
    dataType: 'person',
    isList: true,
    onAdd: (person, relativeId) => person.attachParent(relativeId),
    onDelete: (person, relativeId) => person.detachParent(relativeId),
  },
  {
    name: 'spouses',
    dataType: 'person',
    isList: true,
    onAdd: (person, relativeId) => person.attachSpouse(relativeId),
    onDelete: (person, relativeId) => person.detachSpouse(relativeId),
  },
  {
    name: 'children',
    dataType: 'person',
    isList: true,
    onAdd: (person, relativeId) => person.attachChild(relativeId),
    onDelete: (person, relativeId) => person.detachChild(relativeId),
  },
  {
    name: 'tags',
    dataType: 'tag',
    isList: true,
  },
  {
    // TODO: gradually move things here, and then into a regular model schema.
    name: 'additionalSchema',
    value: {
      avatar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PersonAvatar',
      },
      links: [String],
    },
  },
];
