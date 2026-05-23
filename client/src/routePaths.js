const OLD_APP_URL = 'http://localhost:9000';

// Alphabetical; singular.
// Do not use variables for anything that is not a dynamic url param.
export const ROUTE_PATHS = new Proxy(
  {
    cemeteryDetail: id => `/cemetery/${id}`,
    cemeteryIndex: '/cemeteries',
    eventDetail: id => `${OLD_APP_URL}/event/${id}`, // use in places that eventually want new route
    eventDetailOld: id => `${OLD_APP_URL}/event/${id}`, // use for specifically linking to old version
    eventIndex: '/events',
    eventIndexCategory: category => `/events/${category}`,
    newspaperDetail: id => `/story/${id}`, // to replace with newspaper specific route eventually
    newspaperIndex: '/newspapers',
    personDetail: id => `/person/${id}`,
    personDetailAvatar: id => `/person/${id}/avatar`,
    personDetailChecklist: id => `/person/${id}/checklist`,
    personDetailCitations: id => `/person/${id}/citations`,
    personDetailEdit: id => `/person/${id}/edit`,
    personDetailLinks: id => `/person/${id}/links`,
    personDetailPhotos: id => `/person/${id}/photos`,
    personDetailTags: id => `/person/${id}/tags`,
    personDetailTechnical: id => `/person/${id}/technical`,
    personDetailTimeline: id => `/person/${id}/timeline`,
    personIndex: '/people',
    specialCauseOfDeath: '/cause-of-death',
    storyIndex: '/stories',
    storyIndexWithType: storyType => `/stories/${storyType}`,
  },
  {
    // Throw an error when accessing a key that doesn't exist.
    get(target, key) {
      if (!(key in target)) {
        throw new Error(`Unknown route path: "${key}"`);
      }
      return target[key];
    },
  },
);
