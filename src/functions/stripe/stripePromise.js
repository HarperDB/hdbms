import { loadStripe } from '@stripe/stripe-js';
import config from '../../config';
const stripePromise = loadStripe(config.stripePublicKey);
export default stripePromise;