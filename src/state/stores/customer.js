import { createStore, createHook } from 'react-sweet-state';

const Store = createStore({
  initialState: {
    customer: false,
  },
  actions: {
    setCustomer: (customer) => ({ setState }) => {
      setState({ customer });
    },
  },
  name: 'customer',
});

export default createHook(Store);
