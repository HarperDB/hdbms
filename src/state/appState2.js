import { createStore, createHook } from 'react-sweet-state';
import getUser from '../api/lms/getUser';

// This is the value of the store on initialisation
const initialState = {
  auth: false,
  loggingIn: false,
  loginError: false,
  customer: false,
  users: false,
  products: false,
  regions: false,
  instances: false,
  hasCard: false,
  version: { number: '2.0.37-BETA', location: 'https://registry.npmjs.org/harperdb/-/harperdb-2.0.37-BETA.tgz' },
};

// All the actions that mutate the store
const authActions = {
  login: () => async ({ getState, setState }, { email, pass }) => {
    if (getState().loggingIn) return;
    setState({ loggingIn: true });
    const result = await getUser({
      auth: { email, pass },
      email,
    });
    if (result.error) {
      setState({ loggingIn: false, loginError: result.message });
    } else {
      setState({ loggingIn: false, auth: result });
    }
  },
};

const Store = createStore({ initialState, authActions, name: 'appState' });

export default createHook(Store);
