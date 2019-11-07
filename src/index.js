import React from 'react';
import { createRoot } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { HarperDBProvider } from './providers/harperdb';
import App from './components/app';

const rootEl = document.getElementById('app');
const root = createRoot(rootEl);
root.render(<HarperDBProvider><BrowserRouter><App /></BrowserRouter></HarperDBProvider>);
