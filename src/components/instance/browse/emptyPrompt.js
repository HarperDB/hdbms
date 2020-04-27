import React from 'react';
import { CardBody, Card } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import instanceState from '../../../state/instanceState';

export default ({ message }) => {
  const loading = useStoreState(instanceState, (s) => s.loading);

  return (
    <>
      <div className="floating-card-header text-right">
        <i
          title="Refresh instance schema and tables"
          className={`fa mr-2 ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`}
          onClick={() =>
            instanceState.update((s) => {
              s.lastUpdate = Date.now();
            })
          }
        />
      </div>
      <Card className="my-3 py-5">
        <CardBody>
          <div className="text-center">{message}</div>
        </CardBody>
      </Card>
    </>
  );
};
