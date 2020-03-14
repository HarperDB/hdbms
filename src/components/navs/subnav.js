import React from 'react';
import { Navbar, Nav, NavItem, Input, Button, ToggleButton } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

export default ({ routes = [], instanceId = false, setFilters = false, filters }) => (
  <Navbar id="app-subnav" fixed="top" expand="xs">
    <Nav navbar>
      {setFilters ? (
        <>
          <div className="instance-toggle-holder">
            <ToggleButton
              width="100%"
              icons={{
                checked: <div>local</div>,
                unchecked: <div>local</div>,
              }}
              checked={filters.local}
              onChange={(e) => setFilters({ ...filters, local: e.target.checked })}
            />
          </div>
          <div className="instance-toggle-holder">
            <ToggleButton
              width="100%"
              icons={{
                checked: <div>cloud</div>,
                unchecked: <div>cloud</div>,
              }}
              checked={filters.cloud}
              onChange={(e) => setFilters({ ...filters, cloud: e.target.checked })}
            />
          </div>
          <div className="instance-filter-holder">
            <Input
              type="text"
              className="outline-dark text-center"
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="filter instances"
              value={filters.search}
            />
            {filters.search && (
              <Button className="clear-filter" onClick={() => setFilters({ ...filters, search: '' })}>
                <i className="fa fa-times text-white" />
              </Button>
            )}
          </div>
        </>
      ) : routes.map((route) => (
        <NavItem key={route.path}>
          <NavLink className="text-capitalize" to={instanceId ? `/instance/${instanceId}/${route.link}` : `/account/${route.link}`}>
            <i className={`d-none d-sm-inline-block fa mr-2 fa-${route.icon}`} />
            {route.link}
          </NavLink>
        </NavItem>
      ))}
    </Nav>
  </Navbar>
);
