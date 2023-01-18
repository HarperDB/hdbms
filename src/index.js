import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { positions, Provider } from 'react-alert';
import { Elements } from '@stripe/react-stripe-js';
import Analytics from 'react-router-ga';

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
        <Analytics trackPathnameOnly id={config.google_analytics_code}>
          <App />
        </Analytics>
      </BrowserRouter>
    </Provider>
  </Elements>
);
