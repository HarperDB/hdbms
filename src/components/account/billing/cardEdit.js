import React, { useState } from 'react';
import { Button, Row, Col, Input } from '@nio/ui-kit';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from '@stripe/react-stripe-js';
import useAsyncEffect from 'use-async-effect';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { useAlert } from 'react-alert';

import cardOptions from '../../../util/stripe/cardOptions';
import useLMS from '../../../state/stores/lmsAuth';
import defaultLMSAuth from '../../../state/defaults/defaultLMSAuth';
import addPaymentMethod from '../../../api/lms/addPaymentMethod';
import removePaymentMethod from '../../../api/lms/removePaymentMethod';

export default ({ setEditingCard, cardId, stripeId, setLastUpdate }) => {
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const history = useHistory();
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const [postalCode, setPostalCode] = useState(false);
  const [cardSubmitted, setCardSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { returnURL } = queryString.parse(location.search);

  useAsyncEffect(async () => {
    if (cardSubmitted && stripe && elements) {
      if (cardComplete) setProcessing(true);
      const newCardObject = { type: 'card', card: elements.getElement(CardNumberElement), billing_details: { address: { postal_code: postalCode } } };
      const payload = await stripe.createPaymentMethod(newCardObject);

      if (payload.error) {
        setError(payload.error);
      } else {
        if (cardId) {
          await removePaymentMethod({ auth: lmsAuth, payload: { stripe_id: stripeId, payment_method_id: cardId } });
        }
        const response = await addPaymentMethod({ auth: lmsAuth, payload: { payment_method_id: payload.paymentMethod.id, stripe_id: stripeId } });
        if (response.result) {
          setLastUpdate(Date.now());
          setEditingCard(false);
          alert.success(response.message);
          if (returnURL) {
            setTimeout(() => history.push(returnURL), 100);
          }
        } else {
          setError({ message: response.message });
        }
      }
      setCardSubmitted(false);
      setProcessing(false);
    }
  }, [cardSubmitted]);

  return (
    <div>
      <Row>
        <Col xs="6" className="mb-2 text text-nowrap d-none d-md-block pt-2">
          card number
        </Col>
        <Col md="6" xs="12" className="text-md-right text-center">
          <div className="fake-input">
            <CardNumberElement
              options={cardOptions}
              onChange={(e) => { setError(e.error); setCardComplete(e.complete); }}
            />
          </div>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs="6" className="mb-2 text text-nowrap d-none d-md-block pt-2">
          expiration
        </Col>
        <Col md="6" xs="12" className="text-md-right text-center">
          <div className="fake-input">
            <CardExpiryElement
              options={cardOptions}
              onChange={(e) => { setError(e.error); setCardComplete(e.complete); }}
            />
          </div>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs="6" className="mb-2 text text-nowrap d-none d-md-block pt-2">
          cvcc
        </Col>
        <Col md="6" xs="12" className="text-md-right text-center">
          <div className="fake-input">
            <CardCvcElement
              options={cardOptions}
              onChange={(e) => { setError(e.error); setCardComplete(e.complete); }}
            />
          </div>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs="6" className="mb-2 text text-nowrap d-none d-md-block pt-2">
          billing postal code
        </Col>
        <Col md="6" xs="12" className="text-md-right text-center">
          <Input
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </Col>
      </Row>
      <hr />
      {cardId ? (
        <Row>
          <Col sm="6">
            <Button disabled={processing} onClick={() => setEditingCard(false)} block color="danger" className="mb-2">Cancel</Button>
          </Col>
          <Col sm="6">
            <Button disabled={processing} onClick={() => setCardSubmitted(true)} block color="purple" className="mb-2">
              {processing ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Save New Card</span>}
            </Button>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col sm="12">
            <Button disabled={processing} onClick={() => setCardSubmitted(true)} block color="purple" className="mb-2">
              {processing ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Add Card To Account</span>}
            </Button>
          </Col>
        </Row>
      )}
      {error && (
        <div className="text-danger text-small text-center">
          <hr className="mt-2" />
          {error.message}
        </div>
      )}
    </div>
  );
};
