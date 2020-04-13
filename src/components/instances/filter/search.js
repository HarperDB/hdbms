import React from 'react';
import { Input, Button } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';

const updateFilter = (e) => {
  appState.update((s) => {
    s.filterSearch = e.target.value;
  });
};

const clearFilter = () => {
  appState.update((s) => {
    s.filterSearch = '';
  });
};

const Search = () => {
  const filterSearch = useStoreState(appState, (s) => s.filterSearch);

  return (
    <>
      <Input type="text" className="instances-filter text-center" onChange={updateFilter} placeholder="filter instances" value={filterSearch} />
      {filterSearch && (
        <Button className="clear-filter" onClick={clearFilter}>
          <i className="fa fa-times text-white" />
        </Button>
      )}
    </>
  );
};

export default Search;
