const constants = {};
module.exports = constants;

constants.fields = [
  {name: 'title'},
  {name: 'definition', inputType: 'textarea'},
  {name: 'tags', multi: true},
];

constants.modelsThatHaveTags = [
  {name: 'Event', plural: 'events'},
  {name: 'Image', plural: 'images'},
  {name: 'Notation', plural: 'notations'},
  {name: 'Person', plural: 'people'},
  {name: 'Source', plural: 'sources'},
  {name: 'Story', plural: 'stories'},
  {name: 'Tag', plural: 'tags'},
];
