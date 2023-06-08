import React from 'react';
import { Button } from 'reactstrap';

function ActionUnregistered({ handleRemoveNode, handleRegisterNode, loading }) {
  return <>
    <Button color="success" className="round me-1" title="Add Instance To Studio" onClick={handleRegisterNode}>
      <i className="fa fa-plus text-white" />
    </Button>
    <Button color="danger" className="round" title="Remove Instance From Cluster Config" disabled={loading} onClick={handleRemoveNode}>
      <i className={`fa ${loading ? 'fa-spin fa-spinner' : 'fa-times'} text-white`} />
    </Button>
  </>
}

export default ActionUnregistered;
