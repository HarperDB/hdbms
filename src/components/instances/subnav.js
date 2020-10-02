import React from 'react';
import { Navbar, Nav } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';

import Local from './filter/local';
import Cloud from './filter/cloud';
import Search from './filter/search';
import Refresh from './filter/refresh';
import ErrorFallback from '../shared/errorFallback';
import addError from '../../api/lms/addError';

const SubNav = ({ refreshInstances }) => (
  <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
    <Navbar className="app-subnav">
      <Nav navbar>
        <Local />
        <Cloud />
        <Search />
        <Refresh refreshInstances={refreshInstances} />
      </Nav>
    </Navbar>
  </ErrorBoundary>
);

export default SubNav;
