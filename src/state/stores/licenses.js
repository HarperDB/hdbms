import { createStore, createHook } from 'react-sweet-state';

const Store = createStore({
  initialState: {
    licenses: false,
  },
  actions: {
    setLicenses: (licenses) => ({ setState }) => {
      setState({ licenses });
    },
  },
  name: 'licenses',
});

export default createHook(Store);
