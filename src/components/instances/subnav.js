import React from 'react';
import { Navbar, Nav, Input, Button, ToggleButton } from '@nio/ui-kit';

export default ({ setFilters, filters }) => (
  <Navbar className="app-subnav" fixed="top" expand="xs">
    <Nav navbar>
      <div className="instance-toggle-holder">
        <ToggleButton
          width="100%"
          icons={{
            checked: <div>local</div>,
            unchecked: <div>local</div>,
          }}
          checked={filters.local}
          onChange={(e) =>
            setFilters({
              ...filters,
              local: e.target.checked,
            })
          }
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
          onChange={(e) =>
            setFilters({
              ...filters,
              cloud: e.target.checked,
            })
          }
        />
      </div>
      <div className="instance-filter-holder">
        <Input
          type="text"
          className="instances-filter text-center"
          onChange={(e) =>
            setFilters({
              ...filters,
              search: e.target.value,
            })
          }
          placeholder="filter instances"
          value={filters.search}
        />
        {filters.search && (
          <Button
            className="clear-filter"
            onClick={() =>
              setFilters({
                ...filters,
                search: '',
              })
            }
          >
            <i className="fa fa-times text-white" />
          </Button>
        )}
      </div>
    </Nav>
  </Navbar>
);
