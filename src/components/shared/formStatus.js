import React from 'react';
import { Card, CardBody } from '@nio/ui-kit';

export default ({ header, subhead = ' ', height, status }) => (
  <Card className="form-status">
    <CardBody className="text-center" style={{ height }}>
      <div className="text-bold">{header}</div>
      <div className="py-4">
        <i
          className={`fa fa-lg ${
            status === 'processing' ? 'fa-spinner fa-spin text-purple' : status === 'success' ? 'fa-check-circle text-purple' : 'fa-exclamation-triangle text-danger'
          }`}
        />
      </div>
      <div className="text-grey">{subhead}</div>
    </CardBody>
  </Card>
);
