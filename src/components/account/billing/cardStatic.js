import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { Row, Col, Button } from '@nio/ui-kit';
import { useAlert } from 'react-alert';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';

import removePaymentMethod from '../../../api/lms/removePaymentMethod';

export default ({ setEditingCard, setLastUpdate, stripeId, cardId, cardPostalCode, cardLast4, cardExp }) => {
  const lmsAuth = useStoreState(appState, (s) => s.auth);
  const instances = useStoreState(appState, (s) => s.instances);
  const alert = useAlert();
  const [formState, setFormState] = useState({});

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const hasPaidInstance = instances.find((i) => i.compute.price !== 'FREE' || (i.storage && i.storage.price !== 'FREE'));
      if (hasPaidInstance) {
        setFormState({ error: 'You may not remove your payment method if you have active, non-free instances' });
      } else {
        const response = await removePaymentMethod({ auth: lmsAuth, payload: { stripe_id: stripeId, payment_method_id: cardId } });
        if (response.result) {
          setLastUpdate(Date.now());
          alert.success(response.message);
          setFormState({});
        } else {
          setFormState({ error: response.message });
        }
      }
    }
  }, [formState]);

  return (
    <>
      <Row className="standardHeight">
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          card number
        </Col>
        <Col md="6" xs="12">
          <div className="input-static">**** **** **** {cardLast4}</div>
        </Col>
      </Row>
      <hr />
      <Row className="standardHeight">
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          expiration
        </Col>
        <Col md="6" xs="12">
          <div className="input-static">{cardExp}</div>
        </Col>
      </Row>
      <hr />
      <Row className="standardHeight">
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          cvcc
        </Col>
        <Col md="6" xs="12">
          <div className="input-static">***</div>
        </Col>
      </Row>
      <hr />
      <Row className="standardHeight">
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          billing postal code
        </Col>
        <Col md="6" xs="12">
          <div className="input-static">{cardPostalCode}</div>
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
            onClick={() => setFormState({ submitted: true })}
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
  );
};
