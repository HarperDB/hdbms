import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { positions, Provider } from 'react-alert';
import { Elements } from '@stripe/react-stripe-js';

// incompatible with react-router-dom v6

import stripePromise from './functions/stripe/stripePromise';
import config from './config';
import App from './components/App';
import AlertTemplate from './components/shared/Alert';

import './app.scss';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <Elements stripe={stripePromise} options={{ fonts: [{ cssSrc: 'https://fonts.googleapis.com/css?family=Raleway&display=swap' }] }}>
    <Provider template={AlertTemplate} timeout={4000} position={positions.TOP_CENTER}>
      <BrowserRouter>
          {/* NOTE: removed Analytics tag, incompatible with react router v6 */}
          {/* TODO: re-impliment GA functionality for rrdv6 */}
          <App />
      </BrowserRouter>
    </Provider>
  </Elements>
);
