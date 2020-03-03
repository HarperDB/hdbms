import React, { useState } from 'react';
import { Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import getInvoices from '../../../api/lms/getInvoices';
import useLMS from '../../../state/stores/lmsAuth';
import defaultLMSAuth from '../../../state/defaults/defaultLMSAuth';

export default () => {
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const [customerInvoices, setCustomerInvoices] = useState([]);

  useAsyncEffect(async () => {
    const newCustomerInvoices = await getInvoices({ auth: lmsAuth });
    setCustomerInvoices(newCustomerInvoices);
  }, []);

  return customerInvoices.map((i) => (
    <div key={i.id}>
      <Row className="standardHeight">
        <Col xs="9" className="text text-nowrap">
          {new Date(i.created * 1000).toLocaleString()}
        </Col>
        <Col xs="3" className="text-right text text-nowrap">
          $
          {(i.total / 100).toFixed(2)}
        </Col>
      </Row>
      <hr />
    </div>
  ));
};
