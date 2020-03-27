import { Store } from 'pullstate';

const instanceState = new Store({
  instance_name: false,
  instance_region: false,
  compute_stack_id: false,
  stripe_plan_id: false,
  data_volume_size: false,
  host: false,
  post: false,
  is_ssl: false,
  is_local: false,
  url: false,
  auth: false,
  structure: false,
  network: false,
  users: false,
  roles: false,
  license: false,
  compute: false,
  computeProducts: false,
  storage: false,
  storageProducts: false,
  error: false,
  lastUpdate: false,
});

export default instanceState;
