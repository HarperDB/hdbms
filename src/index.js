import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { positions, Provider } from 'react-alert';
import { Elements } from '@stripe/react-stripe-js';
import Analytics from 'react-router-ga';

import './functions/util/textDecoderPolyfill';
import stripePromise from './functions/stripe/stripePromise';
import config from './config';
import App from './components/App';
import AlertTemplate from './components/shared/Alert';

import './app.scss';

render(
  <Elements stripe={stripePromise} options={{ fonts: [{ cssSrc: 'https://fonts.googleapis.com/css?family=Raleway&display=swap' }] }}>
    <Provider template={AlertTemplate} timeout={2000} position={positions.TOP_CENTER}>
      <BrowserRouter>
        <Analytics trackPathnameOnly id={config.google_analytics_code}>
          <App />
        </Analytics>
      </BrowserRouter>
    </Provider>
  </Elements>,
  document.getElementById('app')
);
