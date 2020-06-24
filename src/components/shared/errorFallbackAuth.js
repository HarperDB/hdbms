import React from 'react';
import { NavLink } from 'react-router-dom';

import ErrorFallback from './errorFallback';
import config from '../../../config';

export default ({ error, componentStack, resetErrorBoundary }) => (
  <div id="login-form">
    <div id="login-logo" title="HarperDB Logo" />
    <div className="version">Studio v{config.studio_version}</div>
    <ErrorFallback error={error} componentStack={componentStack} />
    <div className="text-center">
      <NavLink to="/" className="login-nav-link" onClick={resetErrorBoundary}>
        Back to Login
      </NavLink>
    </div>
  </div>
);
