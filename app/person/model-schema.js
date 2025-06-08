export default [
  {
    // Just a detail; no need for a real "image" object.
    name: 'profileImage',
    dataType: String,
    isEditable: () => false,
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
];
