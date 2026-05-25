export default [
  {
    name: 'type',
    dataType: String,
  },
  {
    // phase out "group" attribute: can edit/remove, but not add
    name: 'group',
    dataType: String,
    isEditable: story => story.group,
    includeInExport: false,
  },
  {
    name: 'date',
    dataType: 'date',
    isEditable: story => story.canHaveDate(),
  },
  {
    name: 'location',
    dataType: 'location',
  },
  {
    name: 'people',
    dataType: 'person',
    isList: true,
  },
  {
    name: 'links',
    dataType: 'link',
    isList: true,
  },
  {
    name: 'images',
    dataType: 'image',
    isList: true,
  },
  {
    name: 'tags',
    dataType: 'tag',
    isList: true,
  },
  {
    name: 'content',
    dataType: String,
    isEditable: false,
  },
];
