import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button, Card, CardBody, Col, Input, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import cardOptions from '../../../util/stripe/cardOptions';
import addPaymentMethod from '../../../api/lms/addPaymentMethod';
import getCustomer from '../../../api/lms/getCustomer';
import useApp from '../../../state/stores/appData';
import defaultAppData from '../../../state/defaults/defaultAppData';

export default ({ hasCard, computeProduct, newInstance, storageProduct, setPurchaseStep, lmsAuth }) => {
  const [appData, setAppData] = useApp(defaultAppData);
  const [postalCode, setPostalCode] = useState(false);
  const [cardSubmitted, setCardSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [addedCard, setAddedCard] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useAsyncEffect(async () => {
    if (cardSubmitted) {
      if (cardComplete) setProcessing(true);
      const newCardObject = { type: 'card', card: elements.getElement(CardNumberElement), billing_details: { address: { postal_code: postalCode } } };
      const payload = await stripe.createPaymentMethod(newCardObject);

      if (payload.error) {
        setError(payload.error);
        setProcessing(false);
      } else {
        await addPaymentMethod({ auth: lmsAuth, payload: { payment_method_id: payload.paymentMethod.id, stripe_id: appData.customer.stripe_id } });
        const customer = await getCustomer({ auth: lmsAuth, payload: { customer_id: appData.user.customer_id } });
        setAppData({ ...appData, customer });
        setProcessing(false);
        setAddedCard(true);
      }
      setCardSubmitted(false);
    }
  }, [cardSubmitted]);

  return (
    <Card>
      <CardBody>
        <div className="fieldset-label">Credit Card Details</div>
        <div className="fieldset full-height pt-3">
          {addedCard || hasCard ? (
            <>
              Credit Card was successfully added to your account.
              <hr />
              <Row>
                <Col sm="6">
                  <Button
                    onClick={() => setPurchaseStep(`details_${newInstance.is_local ? 'local' : 'cloud'}`)}
                    title="Back to Instance Details"
                    block
                    color="purple"
                    outline
                  >
                    <i className="fa fa-chevron-circle-left mr-2" />Instance Details
                  </Button>
                </Col>
                <Col sm="6">
                  <Button
                    title="Review Instance Details"
                    onClick={() => setPurchaseStep('confirm')}
                    block
                    color="purple"
                    className="mb-2"
                  >
                    Review Instance Details<i className="fa fa-chevron-circle-right ml-2" />
                  </Button>
                </Col>
              </Row>
            </>
          ) : (
            <>
              {computeProduct.price !== 'FREE' && <div className="mb-2">The selected <b>instance type</b> has a cost of <b>${computeProduct.price}/{computeProduct.interval}</b>.</div>}
              {storageProduct.price !== 'FREE' && <div className="mb-2">The selected <b>storage size</b> has a cost of <b>${storageProduct.price}/{storageProduct.interval}</b>.</div>}
              Please add a credit card to your account using the form below. If you registered using a promo code, your card will not be charged until your promo credits run out.
              <hr className="mt-4 mb-2" />
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
              <hr className="my-2" />
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
              <hr className="my-2" />
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
              <hr className="my-2" />
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
              <hr className="mt-2 mb-3" />
              <Row>
                <Col sm="6">
                  <Button
                    onClick={() => setPurchaseStep(`details_${newInstance.is_local ? 'local' : 'cloud'}`)}
                    title="Back to Instance Details"
                    block
                    color="purple"
                    outline
                  >
                    <i className="fa fa-chevron-circle-left mr-2" />Instance Details
                  </Button>
                </Col>
                <Col sm="6">
                  <Button
                    title="Add Card To Account"
                    disabled={processing || !cardComplete || !stripe || !elements}
                    onClick={() => setCardSubmitted(true)}
                    block
                    color="purple"
                  >
                    Add Card To Account<i className="fa fa-chevron-circle-right ml-2" />
                  </Button>
                </Col>
              </Row>
              {error && (
                <div className="text-danger text-small text-center">
                  <hr className="mt-2" />
                  {error.message}
                </div>
              )}
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
