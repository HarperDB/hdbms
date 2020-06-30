import React, { useState } from 'react';
import { RadioCheckbox, Button, Card, CardBody, Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';

import useNewInstance from '../../../state/newInstance';
import ContentContainer from '../../shared/contentContainer';

export default () => {
  const history = useHistory();
  const { customer_id } = useParams();
  const products = useStoreState(appState, (s) => s.products.localCompute);
  const hasCard = useStoreState(appState, (s) => s.hasCard);
  const [newInstance, setNewInstance] = useNewInstance({});
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({ stripe_plan_id: newInstance.stripe_plan_id || products[0].value });
  const defaultValue =
    products && newInstance.stripe_plan_id
      ? products.find((p) => p.value === newInstance.stripe_plan_id)
      : newInstance.ram_allocation
      ? products.find((p) => p.ram_allocation === newInstance.ram_allocation)
      : products[0];
  const computePrice = defaultValue?.price;
  const isFree = !computePrice;
  const needsCard = products && !hasCard && !isFree;

  useAsyncEffect(() => {
    const { submitted } = formState;
    const { stripe_plan_id } = formData;
    if (submitted) {
      if (stripe_plan_id) {
        setNewInstance({ ...newInstance, stripe_plan_id });
        setTimeout(() => history.push(needsCard ? `/o/${customer_id}/instances/new/payment` : `/o/${customer_id}/instances/new/confirm`), 0);
      } else {
        setFormState({ error: 'All fields must be filled out.' });
      }
    }
  }, [formState]);

  return (
    <>
      <Card>
        <CardBody>
          <ContentContainer header="Instance RAM">
            <RadioCheckbox
              className="radio-button"
              type="radio"
              required
              onChange={(value) => setFormData({ ...formData, stripe_plan_id: value })}
              options={products}
              value={formData.stripe_plan_id}
              defaultValue={defaultValue}
            />
          </ContentContainer>
        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button onClick={() => history.push(`/o/${customer_id}/instances/new/meta_local`)} title="Back to Basic Info" block className="mt-3" color="purple">
            <i className="fa fa-chevron-circle-left mr-2" />
            Basic Info
          </Button>
        </Col>
        <Col sm="6">
          <Button onClick={() => setFormState({ submitted: true })} title={needsCard ? 'Add Payment Method' : 'Confirm Instance Details'} block className="mt-3" color="purple">
            {needsCard ? 'Add Payment Method' : 'Confirm Instance Details'}
            <i className="fa fa-chevron-circle-right ml-2" />
          </Button>
        </Col>
      </Row>
      {formState.error && (
        <Card className="mt-3 error">
          <CardBody>{formState.error}</CardBody>
        </Card>
      )}
    </>
  );
};
