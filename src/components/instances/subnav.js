import React from 'react';
import { Navbar, Nav } from '@nio/ui-kit';

import Local from './filter/local';
import Cloud from './filter/cloud';
import Search from './filter/search';

const SubNav = () => (
  <Navbar className="app-subnav">
    <Nav navbar>
      <Local />
      <Cloud />
      <Search />
    </Nav>
  </Navbar>
);

export default SubNav;
