import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';

import useNewInstance from '../../../state/newInstance';
import ContentContainer from '../../shared/contentContainer';
import RadioCheckbox from '../../shared/radioCheckbox';

export default () => {
  const history = useHistory();
  const { customer_id } = useParams();
  const [newInstance, setNewInstance] = useNewInstance({});
  const unusedCompute = useStoreState(
    appState,
    (s) => s.subscriptions?.local_compute.filter((p) => !p.value.compute_subscription_name || p.value.compute_quantity_available) || []
  );
  const products = useStoreState(appState, (s) => (newInstance.showPrepaidCompute ? unusedCompute : s.products.local_compute.filter((p) => p.value.active)), [
    newInstance.showPrepaidCompute,
  ]);
  const hasCard = useStoreState(appState, (s) => s.hasCard);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({ ...products[0]?.value, ...newInstance });

  const selectedCompute =
    products &&
    formData.stripe_plan_id &&
    products.find(
      (p) => p.value.stripe_plan_id === formData.stripe_plan_id && (!formData.compute_subscription_id || p.value.storage_subscription_id === formData.compute_subscription_id)
    );
  const computePrice = selectedCompute?.value.compute_price;
  const isFree = !computePrice;
  const needsCard = products && !hasCard && !isFree;

  const computeSubheader =
    unusedCompute.length || newInstance.showPrepaidCompute ? (
      <span>
        <div className="d-inline align-top mr-2">show prepaid options:</div>
        <Button color="link" onClick={() => setNewInstance({ ...newInstance, showPrepaidCompute: !newInstance.showPrepaidCompute })}>
          <i className={`fa fa-lg text-lightpurple fa-toggle-${newInstance.showPrepaidCompute ? 'on' : 'off'}`} />
        </Button>
      </span>
    ) : (
      ''
    );

  useAsyncEffect(() => {
    const { submitted } = formState;
    const { stripe_plan_id } = formData;
    if (submitted) {
      if (stripe_plan_id) {
        setNewInstance({ ...newInstance, ...formData });
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
          <ContentContainer header="Instance RAM" subheader={computeSubheader}>
            <RadioCheckbox
              className="radio-button"
              type="radio"
              required
              onChange={(value) => setFormData({ ...formData, ...value })}
              options={products}
              value={formData.stripe_plan_id}
              defaultValue={selectedCompute || products[0]}
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
