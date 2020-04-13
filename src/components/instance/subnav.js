import React from 'react';
import { Navbar, Nav, NavItem, SelectDropdown } from '@nio/ui-kit';
import { NavLink, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useHistory } from 'react-router';

import appState from '../../state/appState';
import instanceState from '../../state/instanceState';

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

const excludeFromDropdown = ['CREATE_IN_PROGRESS', 'DELETE_IN_PROGRESS', 'UPDATE_IN_PROGRESS', 'WAITING ON APIGATEWAY'];

export default ({ routes = [] }) => {
  const { compute_stack_id } = useParams();
  const history = useHistory();
  const defaultBrowseURL = useStoreState(instanceState, (s) => s.defaultBrowseURL);
  const { options, activeOption } = useStoreState(
    appState,
    (s) => {
      const selectedInstance = s.instances.find((i) => i.compute_stack_id === compute_stack_id);
      const otherInstances = s.instances.filter((i) => !excludeFromDropdown.includes(i.status) && i.compute_stack_id !== compute_stack_id);
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
      <Nav navbar className="instance-select">
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
          noOptionsMessage={() => 'No other instances available'}
          styles={{
            option: (styles, { data }) => ({ ...styles, ...icon(data.is_local) }),
            singleValue: (styles, { data }) => ({ ...styles, ...icon(data.is_local) }),
          }}
        />
      </Nav>
      <Nav navbar className="instance-nav">
        {routes.map((route) => (
          <NavItem key={route.path}>
            <NavLink className="text-capitalize nav-link" to={`/instance/${compute_stack_id}/${route.link === 'browse' ? `${route.link}/${defaultBrowseURL}` : route.link}`}>
              <i className={`d-none d-sm-inline-block fa mr-2 fa-${route.icon}`} />
              {route.link}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    </Navbar>
  );
};
