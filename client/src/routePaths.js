// Alphabetical; singular.
// Do not use variables for anything that is not a dynamic url param.
export const ROUTE_PATHS = new Proxy(
  {
    cemeteryDetail: id => `/cemetery/${id}`,
    cemeteryIndex: '/cemeteries',
    eventDetail: id => `http://localhost:9000/event/${id}`, // use in places that eventually want new route
    eventDetailOld: id => `http://localhost:9000/event/${id}`, // use for specifically linking to old version
    eventIndex: '/events',
    eventIndexCategory: category => `/events/${category}`,
    newspaperDetail: id => `/story/${id}`, // to replace with newspaper specific route eventually
    newspaperIndex: '/newspapers',
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
