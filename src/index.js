import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { positions, Provider } from 'react-alert';
import { Elements } from '@stripe/react-stripe-js';

import './util/textDecoderPolyfill';
import stripePromise from './util/stripePromise';
import AlertTemplate from './components/shared/alert';
import App from './components/app';
import './app.scss';

render(
  (
    <Elements stripe={stripePromise} options={{ fonts: [{ cssSrc: 'https://fonts.googleapis.com/css?family=Raleway' }] }}>
      <Provider template={AlertTemplate} timeout={2000} position={positions.TOP_CENTER}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </Elements>
  ),
  document.getElementById('app'),
);
