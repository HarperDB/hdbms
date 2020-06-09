import React, { useState } from 'react';
import { Row, Col, Button, Input } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router';

import appState from '../../state/appState';

import addCoupon from '../../api/lms/addCoupon';
import getCustomer from '../../api/lms/getCustomer';

export default () => {
  const { customer_id } = useParams();
  const auth = useStoreState(appState, (s) => s.auth);
  const [formData, setFormData] = useState({ coupon_code: '' });
  const [formState, setFormState] = useState({});
  const [mounted, setMounted] = useState(false);
  let controller;

  useAsyncEffect(
    async () => {
      if (formState.submitted) {
        const { coupon_code } = formData;
        if (!coupon_code) {
          setFormState({ error: 'Please enter a valid coupon code' });
        } else {
          controller = new AbortController();
          const response = await addCoupon({ auth, customer_id, coupon_code });

          if (response.result === false || response.error) {
            setFormData({ coupon_code: '' });
            setFormState({ error: response.message });
          } else {
            await getCustomer({ auth, customer_id });
            if (mounted) {
              setFormData({ coupon_code: '' });
              setFormState({});
            }
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

  useAsyncEffect(
    () => setMounted(true),
    () => setMounted(false),
    []
  );

  return (
    <Row>
      <Col md="6">
        <Input
          className="mb-2"
          type="text"
          value={formData.coupon_code}
          invalid={!!formState.error}
          disabled={formState.submitted}
          placeholder="coupon code"
          onChange={(e) => setFormData({ coupon_code: e.target.value })}
        />
      </Col>
      <Col md="6">
        <Button color="purple" disabled={formState.submitted} block onClick={() => setFormState({ submitted: true })}>
          {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Add Coupon</span>}
        </Button>
      </Col>
      <Col xs="12" className="text-center text-danger text-small">
        {formState.error}
      </Col>
    </Row>
  );
};
