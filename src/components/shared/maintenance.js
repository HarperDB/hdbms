import React from 'react';

import AuthStateLoader from './authStateLoader';
import config from '../../../config';

export default () => (
  <div id="login-form">
    <div id="login-logo" title="HarperDB Logo" />
    <div className="version">Studio v{config.studio_version}</div>
    <AuthStateLoader header="HarperDB Studio Is Being Updated" body="Please check back in a few minutes and get ready for a whole new batch of awesome!" />
  </div>
);
