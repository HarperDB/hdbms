import { Store } from 'pullstate';

const appState = new Store({
  user: false,
  customer: false,
  products: false,
  regions: false,
  licenses: false,
  instances: false,
});

export default appState;
