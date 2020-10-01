import React from 'react';
import { Button } from 'reactstrap';

const Refresh = ({ refreshInstances }) => (
  <Button className="refresh-instances" color="link" onClick={refreshInstances}><i className="fa fa-refresh mr-2" /><span className="d-none d-md-inline-block">refresh</span></Button>
);

export default Refresh;
