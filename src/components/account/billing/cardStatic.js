import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { Row, Col, Button, CardBody, Card } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';

import removePaymentMethod from '../../../api/lms/removePaymentMethod';
import FormStatus from '../../shared/formStatus';
import getCustomer from '../../../api/lms/getCustomer';

export default ({ setEditingCard, customerCard, formStateHeight }) => {
  const { auth, instances, customer } = useStoreState(appState, (s) => ({
    auth: s.auth,
    instances: s.instances,
    customer: s.customer,
  }));
  const [formState, setFormState] = useState({});

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const hasPaidInstance = instances.find((i) => i.compute.price !== 'FREE' || (i.storage && i.storage.price !== 'FREE'));
      if (hasPaidInstance) {
        setFormState({
          error: 'You have active, non-free instances.',
        });
        setTimeout(() => setFormState({}), 2000);
      } else {
        setFormState({
          processing: true,
        });

        const response = await removePaymentMethod({
          auth,
          payload: {
            stripe_id: customer.stripe_id,
            payment_method_id: customerCard.id,
          },
        });
        if (response.result) {
          setFormState({
            success: true,
          });
          await getCustomer({
            auth,
            payload: {
              customer_id: customer.customer_id,
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
  }, [formState]);

  return formState.processing ? (
    <FormStatus height={formStateHeight} status="processing" header="Removing Card From Account" subhead="The Credit Schnauzer is securely contacting Stripe." />
  ) : formState.success ? (
    <FormStatus height={formStateHeight} status="success" header="Card Removed Successfully" subhead="Your account is now limited to free products." />
  ) : formState.error ? (
    <FormStatus height={formStateHeight} status="error" header={formState.error} subhead="You must remove them to remove your card." />
  ) : (
    <>
      <Card className="credit-card-form">
        <CardBody>
          <Row>
            <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
              card number
            </Col>
            <Col md="6" xs="12">
              <div className="input-static">
                **** **** ****
                {customerCard?.card?.last4}
              </div>
            </Col>
            <Col xs="12">
              <hr className="my-2" />
            </Col>
            <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
              expiration
            </Col>
            <Col md="6" xs="12">
              <div className="input-static">{`${customerCard?.card?.exp_month} / ${customerCard?.card?.exp_year}`}</div>
            </Col>
            <Col xs="12">
              <hr className="my-2" />
            </Col>
            <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
              cvcc
            </Col>
            <Col md="6" xs="12">
              <div className="input-static">***</div>
            </Col>
            <Col xs="12">
              <hr className="my-2" />
            </Col>
            <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
              billing postal code
            </Col>
            <Col md="6" xs="12">
              <div className="input-static">{customerCard?.billing_details?.address?.postal_code}</div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button block color="purple" className="mt-3" onClick={() => setEditingCard(true)}>
            Update Card
          </Button>
        </Col>
        <Col sm="6">
          <Button
            title="Remove Card"
            disabled={formState.submitted}
            onClick={() =>
              setFormState({
                submitted: true,
              })
            }
            block
            className="mt-3"
            color="danger"
          >
            Remove Card
          </Button>
        </Col>
      </Row>
    </>
  );
};
