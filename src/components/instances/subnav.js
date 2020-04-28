import React from 'react';
import { Navbar, Nav } from '@nio/ui-kit';

import Local from './filter/local';
import Cloud from './filter/cloud';
import Search from './filter/search';

const SubNav = () => (
  <Navbar className="app-subnav">
    <Nav navbar>
      <div className="instance-toggle-holder">
        <Local />
      </div>
      <div className="instance-toggle-holder">
        <Cloud />
      </div>
      <div className="instance-filter-holder">
        <Search />
      </div>
    </Nav>
  </Navbar>
);

export default SubNav;
