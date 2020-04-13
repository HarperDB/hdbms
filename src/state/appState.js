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
});

export default appState;
