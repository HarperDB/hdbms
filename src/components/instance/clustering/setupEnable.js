import React from 'react';
import { Button } from 'reactstrap';

export default ({ setFormState, disabled }) => (
  <>
    <hr />
    <Button color="success" block onClick={() => setFormState({ submitted: true })} disabled={disabled}>
      Enable Instance Clustering
    </Button>
  </>
);
