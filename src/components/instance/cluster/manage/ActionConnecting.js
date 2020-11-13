import React from 'react';
import { Button } from 'reactstrap';

const ActionConnecting = () => (
  <Button color="purple" className="round" title="Connecting to this instance" disabled>
    <i className="fa fa-spin fa-spinner text-white" />
  </Button>
);

export default ActionConnecting;
