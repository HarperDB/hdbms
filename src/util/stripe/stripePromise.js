import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_QeKQj2ThQ4mqatyLsXCexOmB00he3FXx2P');

export default stripePromise;
