import { Store } from 'pullstate';

const appState = new Store({
  customer: false,
  users: false,
  products: false,
  regions: false,
  licenses: false,
  instances: false,
  lastUpdate: false,
});

export default appState;
