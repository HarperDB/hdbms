import React from 'react';
import { NavLink } from 'react-router-dom';

import ErrorFallback from './ErrorFallback';
import config from '../../config';

const ErrorFallbackAuth = ({ error, componentStack, resetErrorBoundary }) => (
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

export default ErrorFallbackAuth;
