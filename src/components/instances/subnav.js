import React from 'react';
import { Navbar, Nav } from '@nio/ui-kit';

import Local from './filter/local';
import Cloud from './filter/cloud';
import Search from './filter/search';

const SubNav = () => (
  <Navbar className="app-subnav">
    <Nav navbar>
      <div title="toggle local instances" className="instance-toggle-holder">
        <Local />
      </div>
      <div title="toggle cloud instances" className="instance-toggle-holder">
        <Cloud />
      </div>
      <div title="filter instances by name, host, url, or region" className="instance-filter-holder">
        <Search />
      </div>
    </Nav>
  </Navbar>
);

export default SubNav;
