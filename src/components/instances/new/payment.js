import React, { useState } from 'react';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import appState from '../../../state/appState';
import useNewInstance from '../../../state/newInstance';

import addPaymentMethod from '../../../api/lms/addPaymentMethod';
import getCustomer from '../../../api/lms/getCustomer';
import CreditCardForm from '../../shared/creditCardForm';
import FormStatus from '../../shared/formStatus';
import ContentContainer from '../../shared/contentContainer';

export default () => {
  const history = useHistory();
  const { customer_id } = useParams();
  const auth = useStoreState(appState, (s) => s.auth);
  const hasCard = useStoreState(appState, (s) => s.hasCard);
  const stripeId = useStoreState(appState, (s) => s.customer?.stripe_id);
  const products = useStoreState(appState, (s) => s.products);
  const [newInstance] = useNewInstance({});
  const [formData, setFormData] = useState({ postal_code: false, card: false, expire: false, cvc: false });
  const [formState, setFormState] = useState({});
  const stripe = useStripe();
  const elements = useElements();
  const isLocal = newInstance.is_local;
  const computeProduct = products[isLocal ? 'local_compute' : 'cloud_compute'].find((p) => p.value === newInstance.stripe_plan_id);
  const storageProduct = isLocal ? { price: 0 } : products.cloud_storage.find((p) => p.value === newInstance.data_volume_size);

  useAsyncEffect(async () => {
    const { submitted, processing } = formState;
    if (submitted && !processing) {
      const { card, expire, cvc, postal_code } = formData;
      if (!card || !expire || !cvc || !postal_code) {
        setFormState({ error: 'All fields are required' });
        setTimeout(() => setFormState({}), 2000);
      } else {
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardNumberElement),
          billing_details: { address: { postal_code } },
        });

        setFormState({ processing: true });

        if (error) {
          setFormState({ error: error.message });
          setTimeout(() => setFormState({}), 2000);
        } else {
          await addPaymentMethod({ auth, payment_method_id: paymentMethod.id, stripe_id: stripeId, customer_id });
          await getCustomer({ auth, customer_id });
          setFormState({ success: true });
        }
      }
    }
  }, [formState]);

  return formState.processing ? (
    <FormStatus height="400px" status="processing" header="Adding Card To Your Account" subhead="The Credit Schnauzer is securely contacting Stripe." />
  ) : formState.error ? (
    <FormStatus height="400px" status="error" header={formState.error} subhead="Please try again" />
  ) : formState.success || hasCard ? (
    <>
      <FormStatus height="346px" status="success" header="Success!" subhead="Credit Card was successfully added to your account." />
      <Row>
        <Col sm="6">
          <Button
            id="instanceDetailsButton"
            onClick={() => history.push(`/o/${customer_id}/instances/new/details_${isLocal ? 'local' : 'cloud'}`)}
            title="Back to Instance Details"
            block
            color="purple"
            className="mt-3"
          >
            <i className="fa fa-chevron-circle-left mr-2" />
            Instance Details
          </Button>
        </Col>
        <Col sm="6">
          <Button
            id="reviewInstanceDetails"
            title="Review Instance Details"
            onClick={() => history.push(`/o/${customer_id}/instances/new/confirm`)}
            block
            color="purple"
            className="mt-3"
          >
            Review Instance Details
            <i className="fa fa-chevron-circle-right ml-2" />
          </Button>
        </Col>
      </Row>
    </>
  ) : (
    <>
      <Card id="paymentDetails">
        <CardBody>
          <div className="mb-4">
            {computeProduct?.price ? (
              <div className="mb-2">
                The selected <b>instance type</b> has a cost of <b>{computeProduct?.priceStringWithInterval}</b>.
              </div>
            ) : null}
            {storageProduct?.price ? (
              <div className="mb-2">
                The selected <b>storage size</b> has a cost of <b>{storageProduct?.priceStringWithInterval}</b>.
              </div>
            ) : null}
            Please add a credit card to your account using the form below. If you registered using a promo code, your card will not be charged until your promo credits run out.
          </div>
          <ContentContainer header="Credit Card Details">
            <CreditCardForm setFormData={setFormData} formData={formData} setFormState={setFormState} />
          </ContentContainer>
        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button
            id="instanceDetailsButton"
            onClick={() => history.push(`/o/${customer_id}/instances/new/details_${isLocal ? 'local' : 'cloud'}`)}
            title="Back to Instance Details"
            block
            className="mt-3"
            color="purple"
          >
            <i className="fa fa-chevron-circle-left mr-2" />
            Instance Details
          </Button>
        </Col>
        <Col sm="6">
          <Button
            id="addCardToAccount"
            title="Add Card To Account"
            disabled={formState.submitted || !formData.card || !formData.expire || !formData.cvc || !formData.postal_code || !stripe || !elements}
            onClick={() => setFormState({ submitted: true })}
            block
            className="mt-3"
            color="purple"
          >
            Add Card To Account
            <i className="fa fa-chevron-circle-right ml-2" />
          </Button>
        </Col>
      </Row>
    </>
  );
};
