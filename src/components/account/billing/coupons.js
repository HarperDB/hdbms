import React, { useState } from 'react';
import { Row, Col, Button, Input } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';

import addCoupon from '../../../api/lms/addCoupon';
import getCustomer from '../../../api/lms/getCustomer';

export default () => {
  const { auth, customer } = useStoreState(appState, (s) => ({
    auth: s.auth,
    customer: s.customer,
  }));
  const [formData, setFormData] = useState({
    coupon_code: '',
  });
  const [formState, setFormState] = useState({});
  let controller;

  console.log(customer);

  useAsyncEffect(
    async () => {
      if (formState.submitted) {
        const { coupon_code } = formData;
        if (!coupon_code) {
          setFormState({ error: 'Please enter a valid coupon code' });
        } else {
          controller = new AbortController();
          const response = await addCoupon({
            auth,
            customer_id: customer.customer_id,
            coupon_code,
          });

          if (response.result === false) {
            setFormData({ coupon_code: '' });
            setFormState({ error: response.message });
          } else {
            await getCustomer({
              auth,
              payload: {
                customer_id: customer.customer_id,
              },
            });
            setFormData({});
            setFormState({});
          }
        }
      }
    },
    () => controller?.abort(),
    [formState]
  );

  useAsyncEffect(() => {
    if (!formState.submitted) setFormState({});
  }, [formData]);

  return customer.stripe_coupons ? (
    <Row>
      <Col xs="6">
        <b>{customer.stripe_coupons.name}</b>
      </Col>
      <Col xs="6" className="text-right">
        <b>${parseInt(customer.stripe_coupons.amount_off / 100, 10)}</b>
      </Col>
    </Row>
  ) : (
    <Row>
      <Col xs="6">
        <Input
          type="text"
          value={formData.coupon_code}
          invalid={!!formState.error}
          disabled={formState.submitted}
          placeholder={formState.error || 'coupon code'}
          onChange={(e) => setFormData({ coupon_code: e.target.value })}
        />
      </Col>
      <Col xs="6">
        <Button color="success" disabled={formState.submitted} block onClick={() => setFormState({ submitted: true })}>
          {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Add Coupon</span>}
        </Button>
      </Col>
    </Row>
  );
};
