import React from 'react';
import { Input, Button } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import appState from '../../state/appState';

const updateFilter = (e) => {
  appState.update((s) => {
    s.orgSearch = e.target.value;
  });
};

const clearFilter = () => {
  appState.update((s) => {
    s.orgSearch = '';
  });
};

const Search = () => {
  const orgSearch = useStoreState(appState, (s) => s.orgSearch);

  return (
    <>
      <Input type="text" className="orgs-filter text-center" onChange={updateFilter} placeholder="filter organizations" value={orgSearch || ''} />
      {orgSearch && (
        <Button className="clear-filter" onClick={clearFilter}>
          <i className="fa fa-times text-white" />
        </Button>
      )}
    </>
  );
};

export default Search;