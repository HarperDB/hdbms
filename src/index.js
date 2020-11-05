import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { positions, Provider } from 'react-alert';
import { Elements } from '@stripe/react-stripe-js';
import Analytics from 'react-router-ga';

import './functions/util/textDecoderPolyfill';
import stripePromise from './functions/stripe/stripePromise';
import config from './config';
import App from './components/app';
import AlertTemplate from './components/shared/alert';
import reportWebVitals from './reportWebVitals';

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
