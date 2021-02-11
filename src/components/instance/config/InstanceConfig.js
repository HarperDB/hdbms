import React, { useState, useEffect } from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody } from 'reactstrap';

import instanceState from '../../../functions/state/instanceState';
import getConfiguration from '../../../functions/api/instance/getConfiguration';

const InstanceConfig = () => {
  const url = useStoreState(instanceState, (s) => s.url);
  const auth = useStoreState(instanceState, (s) => s.auth);
  const [state, setState] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const data = await getConfiguration({ auth, url });
      setState(data);
    };
    if (auth && url) {
      fetch();
    }
  }, [auth, url]);

  return (
    <>
      <span className="floating-card-header">instance config</span>
      <Card className="mt-3 mb-4 instance-details">
        <CardBody>
          <pre>{JSON.stringify(state)}</pre>
        </CardBody>
      </Card>
    </>
  );
};

export default InstanceConfig;
