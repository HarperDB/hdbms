import React, { useState } from 'react';
import { Button, Row, Col, Input } from '@nio/ui-kit';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from '@stripe/react-stripe-js';
import useAsyncEffect from 'use-async-effect';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';

import cardOptions from '../../../util/stripe/cardOptions';
import useLMS from '../../../state/stores/lmsAuth';
import defaultLMSAuth from '../../../state/defaults/defaultLMSAuth';
import addPaymentMethod from '../../../api/lms/addPaymentMethod';
import getCustomer from '../../../api/lms/getCustomer';
import useApp from '../../../state/stores/appData';
import defaultAppData from '../../../state/defaults/defaultAppData';

export default ({ setEditingCard, customerCard }) => {
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const [appData, setAppData] = useApp(defaultAppData);
  const [postalCode, setPostalCode] = useState(false);
  const [cardSubmitted, setCardSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const history = useHistory();
  const { returnURL } = queryString.parse(location.search);


  useAsyncEffect(async () => {
    if (cardSubmitted && stripe && elements) {
      if (cardComplete) setProcessing(true);
      const newCardObject = { type: 'card', card: elements.getElement(CardNumberElement), billing_details: { address: { postal_code: postalCode } } };
      const payload = await stripe.createPaymentMethod(newCardObject);

      if (payload.error) {
        setError(payload.error);
      } else {
        await addPaymentMethod({ auth: lmsAuth, payload: { payment_method_id: payload.paymentMethod.id, stripe_customer_id: appData.customer.stripe_customer_object.id } });
        const customer = await getCustomer({ auth: lmsAuth, payload: { customer_id: appData.user.customer_id } });
        setAppData({ ...appData, customer });
        setEditingCard(false);
        if (returnURL) {
          setTimeout(() => history.push(returnURL), 100);
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
          <div className="stripe-input-holder">
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
          <div className="stripe-input-holder">
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
          <div className="stripe-input-holder">
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
      {customerCard ? (
        <Row>
          <Col sm="6">
            <Button disabled={processing} onClick={() => setEditingCard(false)} block color="danger" className="mb-2">Cancel</Button>
          </Col>
          <Col sm="6">
            <Button disabled={processing} onClick={() => setCardSubmitted(true)} block color="purple" className="mb-2">Save New Card</Button>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col sm="12">
            <Button disabled={processing} onClick={() => setCardSubmitted(true)} block color="purple" className="mb-2">Add Card To Account</Button>
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
