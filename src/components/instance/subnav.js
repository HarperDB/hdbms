import React from 'react';
import { Navbar, Nav, NavItem, SelectDropdown } from '@nio/ui-kit';
import { NavLink, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useHistory } from 'react-router';

import appState from '../../state/stores/appState';

const icon = (is_local) => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    content: is_local ? '"\f233"' : '"\f0c2"',
    display: 'inline-block',
    font: 'normal normal normal 14px/1 FontAwesome',
    marginRight: 8,
  },
});

export default ({ routes = [] }) => {
  const { compute_stack_id } = useParams();
  const history = useHistory();
  const { options, activeOption } = useStoreState(
    appState,
    (s) => {
      const selectedInstance = s.instances.find((i) => i.compute_stack_id === compute_stack_id);
      const otherInstances = s.instances.filter((i) => i.compute_stack_id !== compute_stack_id);
      return {
        options: otherInstances.map((i) => ({
          label: i.instance_name,
          value: i.compute_stack_id,
          is_local: i.is_local,
        })),
        activeOption: {
          label: selectedInstance?.instance_name,
          value: compute_stack_id,
          is_local: selectedInstance?.is_local,
        },
      };
    },
    [compute_stack_id]
  );

  return (
    <Navbar className="app-subnav" fixed="top" expand="xs">
      <Nav navbar>
        <SelectDropdown
          className="react-select-container"
          classNamePrefix="react-select"
          width="200px"
          onChange={({ value }) => history.push(`/instance/${value}/browse`)}
          options={options}
          value={activeOption}
          defaultValue={activeOption.value}
          isSearchable={false}
          isClearable={false}
          isLoading={!options}
          styles={{
            option: (styles, { data }) => ({ ...styles, ...icon(data.is_local) }),
            singleValue: (styles, { data }) => ({ ...styles, ...icon(data.is_local) }),
          }}
        />
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
