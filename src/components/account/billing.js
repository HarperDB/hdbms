import React, { useState } from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';

import customerHasChargeableCard from '../../util/stripe/customerHasChargeableCard';
import useLMS from '../../stores/lmsData';
import defaultLMSData from '../../util/state/defaultLMSData';
import StaticCard from './billing_cardStatic';
import EditCard from './billing_cardEdit';
import Invoices from './billing_invoices';

export default () => {
  const [lmsData] = useLMS(defaultLMSData);
  const [editingCard, setEditingCard] = useState(false);
  const customerCard = customerHasChargeableCard(lmsData.customer);

  return (
    <Row>
      <Col md="6" className="mb-4">
        <span className="text-white mb-2">card</span>
        <Card className="my-3">
          <CardBody>
            {(editingCard || !customerCard) ? (
              <EditCard
                setEditingCard={setEditingCard}
                customerCard={customerCard}
              />
            ) : (
              <StaticCard
                customerId={lmsData.customer.id}
                customerStripeId={lmsData.customer.stripe_customer_object.id}
                customerCard={customerCard}
                setEditingCard={setEditingCard}
                auth={lmsData.auth}
              />
            )}
          </CardBody>
        </Card>
      </Col>
      <Col md="6" className="mb-4">
        <span className="text-white mb-2">invoices</span>
        <Card className="my-3">
          <CardBody>
            <Invoices />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
