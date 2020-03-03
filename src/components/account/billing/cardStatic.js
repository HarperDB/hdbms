import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { Row, Col, Button } from '@nio/ui-kit';
import { useAlert } from 'react-alert';

import removePaymentMethod from '../../../api/lms/removePaymentMethod';

export default ({ customerId, customerCard, customerStripeId, setEditingCard, auth }) => {
  const [removing, setRemoving] = useState(false);
  const alert = useAlert();

  useAsyncEffect(async () => {
    if (removing) {
      const response = await removePaymentMethod({
        auth,
        payload: {
          customer_id: customerId,
          stripe_card_id: customerCard.id,
          customer_stripe_id: customerStripeId,
        },
      });
      setRemoving(false);
      if (response.result) {
        alert.success(response.message);
      } else {
        alert.error(response.message);
      }
    }
  }, [removing]);

  return (
    <div>
      <Row className="standardHeight">
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          card number
        </Col>
        <Col md="6" xs="12">
          <div className="stripe-input-holder">**** **** **** {customerCard.last4}</div>
        </Col>
      </Row>
      <hr />
      <Row className="standardHeight">
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          expiration
        </Col>
        <Col md="6" xs="12">
          <div className="stripe-input-holder">{customerCard.exp_month} / {customerCard.exp_year}</div>
        </Col>
      </Row>
      <hr />
      <Row className="standardHeight">
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          cvcc
        </Col>
        <Col md="6" xs="12">
          <div className="stripe-input-holder">***</div>
        </Col>
      </Row>
      <hr />
      <Row className="standardHeight">
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          billing postal code
        </Col>
        <Col md="6" xs="12">
          <div className="stripe-input-holder">{customerCard.address_zip}</div>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm="6">
          <Button block color="purple" className="mb-2" onClick={() => setEditingCard(true)}>Update Card</Button>
        </Col>
        <Col sm="6">
          <Button
            block
            color="danger"
            className="mb-2"
            disabled={removing}
            onClick={() => setRemoving(true)}
          >
            Remove Card
          </Button>
        </Col>
      </Row>
    </div>
  );
};
