import React, { useState } from 'react';
import { RadioCheckbox, Button, Card, CardBody, Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import useNewInstance from '../../../state/stores/newInstance';
import ContentContainer from '../../shared/contentContainer';

export default ({ products, hasCard, canAddFreeLocalInstance, freeLocalInstanceLimit }) => {
  const history = useHistory();
  const [newInstance, setNewInstance] = useNewInstance({});
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({
    stripe_plan_id: newInstance.stripe_plan_id || products[0].value,
  });

  const selectedProduct = products && formData.stripe_plan_id && products.find((p) => p.value === formData.stripe_plan_id);
  const computePrice = selectedProduct?.price;
  const isFree = !computePrice;
  const needsCard = products && !hasCard && !isFree;

  useAsyncEffect(() => {
    const { submitted } = formState;
    const { stripe_plan_id } = formData;
    if (submitted) {
      if (isFree && freeLocalInstanceLimit && !canAddFreeLocalInstance) {
        setFormState({
          error: `You are limited to ${freeLocalInstanceLimit} free local instance${freeLocalInstanceLimit !== 1 ? 's' : ''}`,
        });
        setTimeout(() => setFormState({}), 2000);
      } else if (stripe_plan_id) {
        setNewInstance({
          ...newInstance,
          stripe_plan_id,
        });
        setTimeout(() => history.push(needsCard ? '/instances/new/payment' : '/instances/new/confirm'), 0);
      } else {
        setFormState({
          error: 'All fields must be filled out.',
        });
        setTimeout(() => setFormState({}), 2000);
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
              onChange={(value) =>
                setFormData({
                  ...formData,
                  stripe_plan_id: value,
                })
              }
              options={products}
              value={formData.stripe_plan_id}
              defaultValue={newInstance.stripe_plan_id ? products.find((p) => p.value === newInstance.stripe_plan_id) : products[0]}
            />
          </ContentContainer>
        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button onClick={() => history.push('/instances/new/meta_local')} title="Back to Basic Info" block className="mt-3" color="purple">
            <i className="fa fa-chevron-circle-left mr-2" />
            Basic Info
          </Button>
        </Col>
        <Col sm="6">
          <Button
            onClick={() =>
              setFormState({
                submitted: true,
              })
            }
            title={needsCard ? 'Add Payment Method' : 'Confirm Instance Details'}
            block
            className="mt-3"
            color="purple"
          >
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
