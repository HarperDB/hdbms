import React, { useState } from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';

import customerHasChargeableCard from '../../../util/stripe/customerHasChargeableCard';
import useLMS from '../../../state/stores/lmsData';
import defaultLMSData from '../../../state/defaults/defaultLMSData';
import StaticCard from './cardStatic';
import EditCard from './cardEdit';
import Invoices from './invoices';

export default () => {
  const [lmsData] = useLMS(defaultLMSData);
  const [editingCard, setEditingCard] = useState(false);
  const customerCard = customerHasChargeableCard(lmsData.customer);

  return (
    <Row>
      <Col md="6" className="mb-4">
        <span className="text-white mb-2 floating-card-header">card</span>
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
        <span className="text-white mb-2 floating-card-header">invoices</span>
        <Card className="my-3">
          <CardBody>
            <Invoices />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
