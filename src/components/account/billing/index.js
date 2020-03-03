import React, { useState } from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';

import customerHasChargeableCard from '../../../util/stripe/customerHasChargeableCard';
import useLMS from '../../../state/stores/lmsAuth';
import defaultLMSAuth from '../../../state/defaults/defaultLMSAuth';
import StaticCard from './cardStatic';
import EditCard from './cardEdit';
import Invoices from './invoices';
import useApp from '../../../state/stores/appData';
import defaultAppData from '../../../state/defaults/defaultAppData';

export default () => {
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const [appData] = useApp(defaultAppData);
  const [editingCard, setEditingCard] = useState(false);
  const customerCard = customerHasChargeableCard(appData.customer);

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
                customerId={appData.customer.id}
                customerStripeId={appData.customer.stripe_customer_object.id}
                customerCard={customerCard}
                setEditingCard={setEditingCard}
                auth={lmsAuth}
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
