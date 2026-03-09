export const ROUTE_PATHS = new Proxy(
  {
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
