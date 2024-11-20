import React, { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { positions, Provider } from 'react-alert';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from './functions/stripe/stripePromise';
import AlertTemplate from './components/shared/Alert';
import './app.scss';
import config from './config';
const App = lazy(() => import(/* webpackChunkName: "online-app" */'./components/App'));
const LocalApp = lazy(() => import(/* webpackChunkName: "offline-app" */'./components/LocalApp'));
const container = document.getElementById('app');
const root = createRoot(container);
root.render(config.isLocalStudio ? <Provider template={AlertTemplate} timeout={4000} position={positions.TOP_CENTER}>
      <BrowserRouter>
        <LocalApp />
      </BrowserRouter>
    </Provider> : <Elements stripe={stripePromise}>
      <Provider template={AlertTemplate} timeout={4000} position={positions.TOP_CENTER}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </Elements>);