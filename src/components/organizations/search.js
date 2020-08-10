import React from 'react';
import { Input, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';

import appState from '../../state/appState';
import updateFilter from '../../methods/organizations/updateFilter';
import clearFilter from '../../methods/organizations/clearFilter';

const Search = () => {
  const orgSearch = useStoreState(appState, (s) => s.orgSearch);

  return (
    <>
      <Input type="text" className="orgs-filter text-center" onChange={updateFilter} placeholder="filter organizations to which you belong" value={orgSearch || ''} />
      {orgSearch && (
        <Button className="clear-filter" onClick={clearFilter}>
          <i className="fa fa-times text-white" />
        </Button>
      )}
    </>
  );
};

export default Search;
