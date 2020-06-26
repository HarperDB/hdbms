import { loadStripe } from '@stripe/stripe-js';
import config from '../../config';

const stripePromise = loadStripe(config.stripe_public_key);

export default stripePromise;
