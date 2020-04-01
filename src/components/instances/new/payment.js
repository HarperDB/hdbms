import React, { useState } from 'react';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button, Card, CardBody, Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';

import addPaymentMethod from '../../../api/lms/addPaymentMethod';
import getCustomer from '../../../api/lms/getCustomer';

import CreditCardForm from '../../shared/creditCardForm';
import FormStatus from '../../shared/formStatus';
import ContentContainer from '../../shared/contentContainer';

export default ({ hasCard, computeProduct, isLocal, storageProduct }) => {
  const history = useHistory();
  const lmsAuth = useStoreState(appState, (s) => s.auth);
  const customer = useStoreState(appState, (s) => s.customer);
  const [formData, setFormData] = useState({
    postal_code: false,
    card: false,
    expire: false,
    cvc: false,
  });
  const [formState, setFormState] = useState({});
  const stripe = useStripe();
  const elements = useElements();

  useAsyncEffect(async () => {
    const { submitted, processing } = formState;
    if (submitted && !processing) {
      const { card, expire, cvc, postal_code } = formData;
      if (!card || !expire || !cvc || !postal_code) {
        setFormState({
          error: 'All fields are required',
        });
      } else {
        const payload = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardNumberElement),
          billing_details: {
            address: { postal_code },
          },
        });
        setFormState({
          processing: true,
        });

        if (payload.error) {
          setFormState({
            error: payload.error,
          });
          setTimeout(() => setFormState({}), 2000);
        } else {
          await addPaymentMethod({
            auth: lmsAuth,
            payload: {
              payment_method_id: payload.paymentMethod.id,
              stripe_id: customer.stripe_id,
            },
          });
          await getCustomer({
            auth: lmsAuth,
            payload: {
              customer_id: lmsAuth.customer_id,
            },
          });
          setFormState({
            success: true,
          });
        }
      }
    }
  }, [formState]);

  return formState.processing ? (
    <FormStatus height="410px" status="processing" header="Adding Card To Your Account" subhead="The Credit Schnauzer is securely contacting Stripe." />
  ) : formState.error ? (
    <FormStatus height="410px" status="error" header={formState.error} subhead="Please try again" />
  ) : formState.success || hasCard ? (
    <>
      <FormStatus height="358px" status="success" header="Success!" subhead="Credit Card was successfully added to your account." />
      <Row>
        <Col sm="6">
          <Button onClick={() => history.push(`/instances/new/details_${isLocal ? 'local' : 'cloud'}`)} title="Back to Instance Details" block color="purple" className="mt-3">
            <i className="fa fa-chevron-circle-left mr-2" />
            Instance Details
          </Button>
        </Col>
        <Col sm="6">
          <Button title="Review Instance Details" onClick={() => history.push('/instances/new/confirm')} block color="purple" className="mt-3">
            Review Instance Details
            <i className="fa fa-chevron-circle-right ml-2" />
          </Button>
        </Col>
      </Row>
    </>
  ) : (
    <>
      <Card>
        <CardBody>
          <div className="mb-4">
            {computeProduct?.price !== 'FREE' && (
              <div className="mb-2">
                The selected <b>instance type</b> has a cost of{' '}
                <b>
                  ${computeProduct?.price}/{computeProduct?.interval}
                </b>
                .
              </div>
            )}
            {storageProduct?.price !== 'FREE' && (
              <div className="mb-2">
                The selected <b>storage size</b> has a cost of{' '}
                <b>
                  ${storageProduct?.price}/{storageProduct?.interval}
                </b>
                .
              </div>
            )}
            Please add a credit card to your account using the form below. If you registered using a promo code, your card will not be charged until your promo credits run out.
          </div>
          <ContentContainer header="Credit Card Details">
            <CreditCardForm setFormData={setFormData} formData={formData} setFormState={setFormState} />
          </ContentContainer>
        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button onClick={() => history.push(`/instances/new/details_${isLocal ? 'local' : 'cloud'}`)} title="Back to Instance Details" block className="mt-3" color="purple">
            <i className="fa fa-chevron-circle-left mr-2" />
            Instance Details
          </Button>
        </Col>
        <Col sm="6">
          <Button
            title="Add Card To Account"
            disabled={formState.submitted || !formData.card || !formData.expire || !formData.cvc || !formData.postal_code || !stripe || !elements}
            onClick={() =>
              setFormState({
                submitted: true,
              })
            }
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
