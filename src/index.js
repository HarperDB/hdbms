import React, { lazy } from 'react';
import { createRoot } from 'react-dom/client';

import './app.scss';
import config from './config';

const App = lazy(() => import(/* webpackChunkName: "online-app" */ './components/App'));
const LocalApp = lazy(() => import(/* webpackChunkName: "offline-app" */ './components/LocalApp'));

const container = document.getElementById('app');
const root = createRoot(container);

root.render(config.is_local_studio ? <LocalApp /> : <App />);
