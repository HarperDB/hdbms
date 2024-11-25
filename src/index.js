import React, { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { loadReoScript } from 'reodotdev';

import './app.scss';
import config from './config';

const clientID = process.env.CLIENT_ID || "6565c3e84c377ad";
const reoPromise = config.is_local_studio ? Promise.resolve() : loadReoScript({ clientID });

reoPromise
  .then(Reo => {
    Reo.init({ clientID });
  })
  .catch(error => {
    console.error('Error loading Reo', error);
  })

const App = lazy(() => import(/* webpackChunkName: "online-app" */ './components/App'));
const LocalApp = lazy(() => import(/* webpackChunkName: "offline-app" */ './components/LocalApp'));

const container = document.getElementById('app');
const root = createRoot(container);

root.render(config.is_local_studio ? <LocalApp /> : <App />);
