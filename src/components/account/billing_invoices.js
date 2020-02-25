import React, { useState } from 'react';
import { Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import getCustomerInvoices from '../../util/lms/getCustomerInvoices';
import useLMS from '../../stores/lmsData';
import defaultLMSData from '../../util/state/defaultLMSData';

export default () => {
  const [lmsData] = useLMS(defaultLMSData);
  const [customerInvoices, setCustomerInvoices] = useState([]);

  useAsyncEffect(async () => {
    const newCustomerInvoices = await getCustomerInvoices({ auth: lmsData.auth });
    setCustomerInvoices(newCustomerInvoices);
  }, []);

  return customerInvoices.map((i) => (
    <div key={i.id}>
      <Row className="standardHeight">
        <Col xs="9" className="text text-nowrap">
          {new Date(i.invoice_date).toLocaleString()}
        </Col>
        <Col xs="3" className="text-right text text-nowrap">
          $
          {(i.total / 100).toFixed(2)}
        </Col>
      </Row>
      <hr />
    </div>
  ));
}
