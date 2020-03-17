import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { positions, Provider } from 'react-alert';
import { Elements } from '@stripe/react-stripe-js';

import './util/textDecoderPolyfill';
import stripePromise from './util/stripe/stripePromise';
import AlertTemplate from './components/shared/alert';
import App from './components/app';
import ComingSoon from './components/comingSoon';
import './app.scss';

render(
  window.location.host === 'studio.harperdb.io' ? (
    <ComingSoon />
  ) : (
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
