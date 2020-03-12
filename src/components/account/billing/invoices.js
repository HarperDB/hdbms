import React, { Fragment, useState } from 'react';
import { Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';

import getInvoices from '../../../api/lms/getInvoices';
import useLMS from '../../../state/stores/lmsAuth';
import defaultLMSAuth from '../../../state/defaults/defaultLMSAuth';

export default () => {
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const [customerInvoices, setCustomerInvoices] = useState('loading');
  const alert = useAlert();

  useAsyncEffect(async () => {
    const response = await getInvoices({ auth: lmsAuth, payload: { customer_id: lmsAuth.customer_id } });

    if (response.result === false) {
      alert.error('Unable to fetch invoices. Please try again later.');
      setCustomerInvoices('error');
    } else {
      setCustomerInvoices(response);
    }
  }, []);

  return customerInvoices === 'loading' ? (
    <div className="py-5 text-center">
      <i className="fa fa-spinner fa-spin text-purple" />
    </div>
  ) : customerInvoices === 'error' ? (
    <div className="py-5 text-center">
      We were unable to fetch your invoices. Please try again later.
    </div>
  ) : customerInvoices.map((i) => (
    <Fragment key={i.id}>
      <Row>
        <Col xs="9" className="text text-nowrap">
          {new Date(i.created * 1000).toLocaleString()}
        </Col>
        <Col xs="3" className="text-right text text-nowrap">
          $
          {(i.total / 100).toFixed(2)}
        </Col>
      </Row>
      <hr />
    </Fragment>
  ));
};
