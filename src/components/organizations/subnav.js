import React from 'react';
import { Navbar, Nav } from '@nio/ui-kit';

import Search from './search';

const SubNav = () => (
  <Navbar className="app-subnav">
    <Nav navbar>
      <div className="org-filter-holder">
        <Search />
      </div>
    </Nav>
  </Navbar>
);

export default SubNav;
