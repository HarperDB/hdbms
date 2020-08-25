import { Store } from 'pullstate';

const appState = new Store({
  auth: false,
  customer: false,
  users: false,
  products: false,
  regions: false,
  integrations: false,
  subscriptions: false,
  instances: false,
  hasCard: false,
  lastUpdate: false,
  orgSearch: '',
  filterSearch: '',
  filterLocal: true,
  filterCloud: true,
  version: false,
  theme: 'purple',
  postmanCollection: false,
});

export default appState;
