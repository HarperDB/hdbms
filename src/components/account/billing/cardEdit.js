import React, { useState } from 'react';
import { Button, Row, Col, Card, CardBody } from '@nio/ui-kit';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';

import addPaymentMethod from '../../../api/lms/addPaymentMethod';
import getCustomer from '../../../api/lms/getCustomer';

import CreditCardForm from '../../shared/creditCardForm';
import FormStatus from '../../shared/formStatus';

export default ({ setEditingCard, customerCard, formStateHeight }) => {
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
            error: payload.error.message,
          });
        } else {
          const response = await addPaymentMethod({
            auth: lmsAuth,
            payload: {
              payment_method_id: payload.paymentMethod.id,
              stripe_id: customer.stripe_id,
            },
          });

          if (response.result) {
            setFormState({
              success: response.message,
            });

            await getCustomer({
              auth: lmsAuth,
              payload: {
                customer_id: lmsAuth.customer_id,
              },
            });

            setEditingCard(false);
          } else {
            setFormState({
              error: response.message,
            });
          }
        }
      }

      setTimeout(() => setFormState({}), 2000);
    }
  }, [formState]);

  return (
    <>
      {formState.processing ? (
        <FormStatus height={formStateHeight} status="processing" header="Adding Card To Your Account" subhead="The Credit Schnauzer is securely contacting Stripe." />
      ) : formState.success ? (
        <FormStatus height={formStateHeight} status="success" header="Success!" subhead="Credit Card was successfully added to your account." />
      ) : formState.error ? (
        <FormStatus height={formStateHeight} status="error" header={formState.error} subhead="Please try again" />
      ) : (
        <>
          <Card>
            <CardBody>
              <CreditCardForm setFormData={setFormData} formData={formData} />
            </CardBody>
          </Card>
          <Row>
            {customerCard && (
              <Col sm="6">
                <Button onClick={() => setEditingCard(false)} block color="danger" className="mt-3">
                  Cancel
                </Button>
              </Col>
            )}
            <Col>
              <Button
                title={customerCard ? 'Save New Card' : 'Add Card To Account'}
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
                {customerCard ? 'Save New Card' : 'Add Card To Account'}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
