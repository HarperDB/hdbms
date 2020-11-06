import React from 'react';
import { Button } from 'reactstrap';

const SetupEnable = ({ setFormState, disabled }) => (
  <>
    <hr />
    <Button color="success" block onClick={() => setFormState({ submitted: true })} disabled={disabled}>
      Enable Instance Clustering
    </Button>
  </>
);

export default SetupEnable;
