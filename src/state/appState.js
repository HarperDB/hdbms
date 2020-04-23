import { Store } from 'pullstate';

const appState = new Store({
  auth: false,
  customer: false,
  users: false,
  products: false,
  regions: false,
  instances: false,
  hasCard: false,
  lastUpdate: false,
  filterSearch: '',
  filterLocal: true,
  filterCloud: true,
  version: { number: '2.0.37-BETA', location: 'https://registry.npmjs.org/harperdb/-/harperdb-2.0.37-BETA.tgz' },
});

export default appState;
