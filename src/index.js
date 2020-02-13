import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { positions, Provider } from 'react-alert';
import { TextDecoder } from 'text-encoding';

import AlertTemplate from './components/shared/alert';
import App from './components/app';
import './app.scss';

if (!window.TextDecoder) window.TextDecoder = TextDecoder;

render(
  (
    <Provider template={AlertTemplate} timeout={2000} position={positions.TOP_CENTER}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <div id="app-bg" />
    </Provider>
  ),
  document.getElementById('app'),
);
