import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { Row, Col, Button } from '@nio/ui-kit';
import { useAlert } from 'react-alert';

import useLMS from '../../../state/stores/lmsAuth';
import defaultLMSAuth from '../../../state/defaults/defaultLMSAuth';

import removePaymentMethod from '../../../api/lms/removePaymentMethod';

export default ({ setEditingCard, setLastUpdate, stripeId, cardId, cardPostalCode, cardLast4, cardExp }) => {
  const alert = useAlert();
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const [formState, setFormState] = useState({ submitted: false, error: false });

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const response = await removePaymentMethod({ auth: lmsAuth, payload: { stripe_id: stripeId, payment_method_id: cardId } });
      if (response.result) {
        setLastUpdate(Date.now());
        alert.success(response.message);
        setFormState({ error: false, submitted: false });
      } else {
        setFormState({ error: response.message, submitted: false });
      }
    }
  }, [formState]);

  return cardId ? (
    <>
      <Row className="standardHeight">
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          card number
        </Col>
        <Col md="6" xs="12">
          <div className="fake-input">**** **** **** {cardLast4}</div>
        </Col>
      </Row>
      <hr />
      <Row className="standardHeight">
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          expiration
        </Col>
        <Col md="6" xs="12">
          <div className="fake-input">{cardExp}</div>
        </Col>
      </Row>
      <hr />
      <Row className="standardHeight">
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          cvcc
        </Col>
        <Col md="6" xs="12">
          <div className="fake-input">***</div>
        </Col>
      </Row>
      <hr />
      <Row className="standardHeight">
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          billing postal code
        </Col>
        <Col md="6" xs="12">
          <div className="fake-input">{cardPostalCode}</div>
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
            onClick={() => setFormState({ submitted: true, error: false })}
            disabled={formState.submitted}
          >
            {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Remove Card</span>}
          </Button>
        </Col>
      </Row>
      {formState.error && (
        <div className="text-danger text-small text-center text-italic">
          <hr />
          {formState.error}
        </div>
      )}
    </>
  ) : (
    <i className="fa fa-spinner fa-spin text-purple" />
  );
};
