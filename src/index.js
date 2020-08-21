import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { positions, Provider } from 'react-alert';
import { Elements } from '@stripe/react-stripe-js';
import Analytics from 'react-router-ga';

import './methods/util/textDecoderPolyfill';
import stripePromise from './methods/stripe/stripePromise';
import config from './config';

import AlertTemplate from './components/shared/alert';
import * as serviceWorker from './serviceWorker';

import './app.scss';

const App = lazy(() => import(/* webpackChunkName: "app" */ './components/app'));

render(
  <Elements stripe={stripePromise} options={{ fonts: [{ cssSrc: 'https://fonts.googleapis.com/css?family=Raleway&display=swap' }] }}>
    <Provider template={AlertTemplate} timeout={2000} position={positions.TOP_CENTER}>
      <BrowserRouter>
        <Analytics trackPathnameOnly id={config.google_analytics_code}>
          <Suspense fallback={null}>
            <App />
          </Suspense>
        </Analytics>
      </BrowserRouter>
    </Provider>
  </Elements>,
  document.getElementById('app')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
