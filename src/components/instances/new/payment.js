import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button, Card, CardBody, Col, Input, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';

import cardOptions from '../../../util/stripe/cardOptions';
import addPaymentMethod from '../../../api/lms/addPaymentMethod';
import getCustomer from '../../../api/lms/getCustomer';

export default ({ hasCard, computeProduct, isLocal, storageProduct }) => {
  const history = useHistory();
  const lmsAuth = useStoreState(appState, (s) => s.auth);
  const customer = useStoreState(appState, (s) => s.customer);
  const [formData, setFormData] = useState({ postal_code: false, card: false, expire: false, cvc: false });
  const [formState, setFormState] = useState({});
  const stripe = useStripe();
  const elements = useElements();

  useAsyncEffect(async () => {
    const { submitted, processing } = formState;
    if (submitted && !processing) {
      const { card, expire, cvc, postal_code } = formData;
      if (!card || !expire || !cvc || !postal_code) {
        setFormState({ error: 'All fields are required' });
      } else {
        const payload = await stripe.createPaymentMethod({ type: 'card', card: elements.getElement(CardNumberElement), billing_details: { address: { postal_code } } });
        setFormState({ processing: true });

        if (payload.error) {
          setFormState({ error: payload.error });
        } else {
          await addPaymentMethod({ auth: lmsAuth, payload: { payment_method_id: payload.paymentMethod.id, stripe_id: customer.stripe_id } });
          await getCustomer({ auth: lmsAuth, payload: { customer_id: lmsAuth.customer_id } });
          setFormState({ complete: true });
        }
      }
    }
  }, [formState]);

  return formState.processing ? (
    <Card>
      <CardBody>
        <div className="p-4 text-center">
          <b>Adding Credit Card To Your Account</b><br /><br /><br />
          <i className="fa fa-lg fa-spinner fa-spin text-purple mb-4" /><br /><br />
          The credit schnauzer is securely contacting Stripe.
        </div>
      </CardBody>
    </Card>
  ) : formState.complete || hasCard ? (
    <>
      <Card>
        <CardBody>
          <div className="p-4 text-center">
            <b>success!</b><br /><br />
            <i className="fa fa-lg fa-thumbs-up text-purple" /><br /><br />
            Credit Card was successfully added to your account.
          </div>
        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button
            onClick={() => history.push(`/instances/new/details_${isLocal ? 'local' : 'cloud'}`)}
            title="Back to Instance Details"
            block
            color="purple"
            className="mt-3"
          >
            <i className="fa fa-chevron-circle-left mr-2" />Instance Details
          </Button>
        </Col>
        <Col sm="6">
          <Button
            title="Review Instance Details"
            onClick={() => history.push('/instances/new/confirm')}
            block
            color="purple"
            className="mt-3"
          >
            Review Instance Details<i className="fa fa-chevron-circle-right ml-2" />
          </Button>
        </Col>
      </Row>
    </>
  ) : (
    <>
      <Card>
        <CardBody>
          {computeProduct?.price !== 'FREE' && <div className="mb-2">The selected <b>instance type</b> has a cost of <b>${computeProduct?.price}/{computeProduct?.interval}</b>.</div>}
          {storageProduct?.price !== 'FREE' && <div className="mb-2">The selected <b>storage size</b> has a cost of <b>${storageProduct?.price}/{storageProduct?.interval}</b>.</div>}
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
                  onChange={(e) => { setFormState({ error: e.error?.message }); setFormData({ ...formData, card: e.complete }); }}
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
                  onChange={(e) => { setFormState({ error: e.error?.message }); setFormData({ ...formData, expire: e.complete }); }}
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
                  onChange={(e) => { setFormState({ error: e.error?.message }); setFormData({ ...formData, cvc: e.complete }); }}
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
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button
            onClick={() => history.push(`/instances/new/details_${isLocal ? 'local' : 'cloud'}`)}
            title="Back to Instance Details"
            block
            className="mt-3"
            color="purple"
          >
            <i className="fa fa-chevron-circle-left mr-2" />Instance Details
          </Button>
        </Col>
        <Col sm="6">
          <Button
            title="Add Card To Account"
            disabled={formState.submitted || !formData.card || !formData.expire || !formData.cvc || !stripe || !elements}
            onClick={() => setFormState({ submitted: true })}
            block
            className="mt-3"
            color="purple"
          >
            Add Card To Account<i className="fa fa-chevron-circle-right ml-2" />
          </Button>
        </Col>
      </Row>
      {formState.error && (
        <Card className="mt-3 error">
          <CardBody className="text-danger text-small text-center">
            {formState.error}
          </CardBody>
        </Card>
      )}
    </>
  );
};
