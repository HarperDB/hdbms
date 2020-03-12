import { createStore, createHook } from 'react-sweet-state';

const Store = createStore({
  initialState: {
    regions: false,
  },
  actions: {
    setRegions: (regions) => ({ setState }) => {
      setState({ regions });
    },
  },
  name: 'regions',
});

export default createHook(Store);
