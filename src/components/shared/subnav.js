import React from 'react';
import { Navbar, Nav, NavItem, SelectDropdown } from '@nio/ui-kit';
import { NavLink, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';

import routeIcon from '../../methods/select/routeIcon';

export default ({ routes = [] }) => {
  const history = useHistory();
  const location = useLocation();
  const currentRoute = routes?.find((r) => r.link === location.pathname) || routes[0];
  const activeRoute = {
    label: currentRoute.link,
    value: currentRoute.link,
    iconCode: currentRoute.iconCode,
  };

  return (
    <Navbar className="app-subnav">
      <Nav navbar className="instance-nav d-none d-md-flex">
        {routes.map((route) => (
          <NavItem key={route.path}>
            <NavLink title={route.link} className="text-capitalize nav-link" to={route.link || route.path}>
              <i className={`d-none d-sm-inline-block fa mr-2 fa-${route.icon}`} />
              {route.label}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <Nav navbar className="d-flex d-md-none">
        <SelectDropdown
          className="react-select-container"
          classNamePrefix="react-select"
          width="200px"
          onChange={({ value }) => history.push(value)}
          options={routes.map((route) => ({ label: route.link, value: route.link, iconCode: route.iconCode }))}
          value={activeRoute}
          defaultValue={activeRoute.value}
          isSearchable={false}
          isClearable={false}
          styles={{
            option: (styles, { data }) => ({ ...styles, ...routeIcon(data.iconCode) }),
            singleValue: (styles, { data }) => ({ ...styles, ...routeIcon(data.iconCode) }),
          }}
        />
      </Nav>
    </Navbar>
  );
};