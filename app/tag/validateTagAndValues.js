export default function validateTagAndValues(next) {
  if (this.tags.length !== this.tagValues.length) {
    this.invalidate('tags', 'tags and tagValues must have the same length.');
    this.invalidate(
      'tagValues',
      'tags and tagValues must have the same length.',
    );
  }
  next();
}
