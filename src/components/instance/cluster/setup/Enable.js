import React from 'react';
import { Button } from 'reactstrap';

function Enable({ setFormState }) {
  return (
    <>
      <hr className="my-3" />
      <Button color="success" block onClick={() => setFormState({ submitted: true })}>
        Enable Instance Clustering
      </Button>
    </>
  );
}

export default Enable;
