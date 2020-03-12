import { createStore, createHook } from 'react-sweet-state';

const Store = createStore({
  initialState: {
    instances: [],
  },
  actions: {
    setInstances: (instances) => ({ setState }) => {
      setState({ instances });
    },
  },
  name: 'instances',
});

export default createHook(Store);
