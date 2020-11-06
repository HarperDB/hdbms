import { Button } from 'reactstrap';
import React from 'react';

const DetailsSubheader = ({ hasPrepaid, newInstance, setNewInstance, toggleValue }) =>
  hasPrepaid || newInstance[toggleValue] ? (
    <span>
      <div className="d-inline align-top mr-2">show prepaid options:</div>
      <Button color="link" onClick={() => setNewInstance({ ...newInstance, [toggleValue]: !newInstance[toggleValue] })}>
        <i className={`fa fa-lg text-lightpurple fa-toggle-${newInstance[toggleValue] ? 'on' : 'off'}`} />
      </Button>
    </span>
  ) : (
    <span>scroll for more</span>
  );

export default DetailsSubheader;
