import React from 'react';
import { Navbar, Nav, NavItem } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import instanceState from '../../state/stores/instanceState';

export default ({ routes = [], loadingInstance }) => {
  const { instance_name, is_local, compute_stack_id } = useStoreState(instanceState, (s) => ({
    instance_name: s.instance_name,
    is_local: s.is_local,
    compute_stack_id: s.compute_stack_id,
  }));

  return (
    <Navbar className="app-subnav" fixed="top" expand="xs">
      <Nav navbar>
        <NavItem className="text-white">
          {loadingInstance ? (
            <i className="fa fa-spin fa-spinner text-white" />
          ) : (
            <>
              <i className={`mr-2 fa fa-${is_local ? 'server' : 'cloud'}`} /> {instance_name}
            </>
          )}
        </NavItem>
      </Nav>
      <Nav navbar className="instance-nav">
        {routes.map((route) => (
          <NavItem key={route.path}>
            <NavLink className="text-capitalize" to={`/instance/${compute_stack_id}/${route.link}`}>
              <i className={`d-none d-sm-inline-block fa mr-2 fa-${route.icon}`} />
              {route.link}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    </Navbar>
  );
};
