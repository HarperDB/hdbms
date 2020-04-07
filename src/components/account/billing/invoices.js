import React, { Fragment } from 'react';
import { Row, Col, CardBody, Card } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';

import getInvoices from '../../../api/lms/getInvoices';

export default () => {
  const { auth, customer_id, invoices } = useStoreState(appState, (s) => ({
    auth: s.auth,
    customer_id: s.customer.customer_id,
    invoices: s.invoices,
  }));
  let controller;

  useAsyncEffect(
    () => {
      controller = new AbortController();
      getInvoices({
        auth,
        signal: controller.signal,
        customer_id,
      });
    },
    () => controller.abort(),
    []
  );

  return (
    <Card className="no-shadow">
      <CardBody>
        {!invoices ? (
          <div className="py-5 text-center">
            <i className="fa fa-spinner fa-spin text-purple" />
          </div>
        ) : !invoices.length ? (
          <div className="py-5 text-center">We were unable to fetch your invoices. Please try again later.</div>
        ) : (
          <>
            <Row>
              <Col xs="6" className="text text-bold text-small">
                date
              </Col>
              <Col xs="3" className="text-right text-bold text-small">
                amount
              </Col>
              <Col xs="3" className="text-right text-bold text-small">
                print
              </Col>
            </Row>
            {invoices.map((i) => (
              <Fragment key={i.id}>
                <hr className="mt-2" />
                <Row className="pb-2">
                  <Col xs="6" className="text text-nowrap">
                    {new Date(i.created * 1000).toLocaleString()}
                  </Col>
                  <Col xs="3" className="text-right text text-nowrap">
                    ${(i.total / 100).toFixed(2)}
                  </Col>
                  <Col xs="3" className="text-right text text-nowrap">
                    <a title="print invoice" href={i.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                      <i className="fa fa-print text-purple" />
                    </a>
                  </Col>
                </Row>
              </Fragment>
            ))}
          </>
        )}
      </CardBody>
    </Card>
  );
};
