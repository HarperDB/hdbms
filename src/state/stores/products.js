import { createStore, createHook } from 'react-sweet-state';

const Store = createStore({
  initialState: {
    products: false,
  },
  actions: {
    setProducts: (products) => ({ setState }) => {
      setState({ products });
    },
  },
  name: 'products',
});

export default createHook(Store);
