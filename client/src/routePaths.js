export const ROUTE_PATHS = new Proxy(
  {
    eventDetail: id => `http://localhost:9000/event/${id}`, // use in places that eventually want new route
    eventDetailOld: id => `http://localhost:9000/event/${id}`, // use for specifically linking to old version
    eventIndex: '/events',
    eventIndexCategory: category => `/events/${category}`,
  },
  {
    get(target, key) {
      if (!(key in target)) {
        throw new Error(`Unknown route path: "${key}"`);
      }
      return target[key];
    },
  },
);
