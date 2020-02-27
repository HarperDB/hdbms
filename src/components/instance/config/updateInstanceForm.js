import React, { useState } from 'react';
import { Button, Card, CardBody, Input, RadioCheckbox } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import useLMS from '../../../state/lmsData';
import updateInstance from '../../../api/lms/updateInstance';
import updateLicense from '../../../api/lms/updateLicense';
import setLicense from '../../../api/instance/setLicense';
import defaultLMSData from '../../../state/defaults/defaultLMSData';
import defaultInstanceFormData from '../../../state/defaults/defaultInstanceFormData';

export default ({ instanceAuth, details, refreshInstance }) => {
  const [{ auth, products }] = useLMS(defaultLMSData);
  const [formData, updateForm] = useState(defaultInstanceFormData);
  const instanceProducts = !products ? false : details.is_local ? products.local : products.cloud;
  const defaultValue = instanceProducts && instanceProducts.find((p) => p.value === details.stripe_product_id);

  useAsyncEffect(async () => {
    if (formData.submitted) {
      const { stripe_product_id, instance_name } = formData;
      const { instance_id, customer_id, license_id, fingerprint } = details;

      const newLicense = await updateLicense({ auth, payload: { license_id, stripe_product_id, instance_id, customer_id, fingerprint } });
      await setLicense({ auth: instanceAuth, key: newLicense.key, company: newLicense.company });
      await updateInstance({ auth, payload: { stripe_product_id, instance_id, customer_id, instance_name } });
      updateForm({ ...formData, submitted: false });
      refreshInstance(Date.now());
    }
  }, [formData]);

  useAsyncEffect(() => {
    if (details) {
      updateForm({ ...formData, stripe_product_id: details.stripe_product_id, instance_name: details.instance_name });
    }
  }, [details]);

  return (
    <>
      <span className="text-white mb-2 floating-card-header">resize instance</span>
      <Card className="my-3">
        <CardBody>
          {products && defaultValue ? (
            <>
              <div className="new-instance-label">Instance Name</div>
              <div className="fieldset">
                <Input
                  onChange={(e) => updateForm({ ...formData, instance_name: e.target.value, error: false })}
                  type="text"
                  title="instance_name"
                  value={formData.instance_name}
                />
              </div>

              <div className="new-instance-label">Instance Type</div>
              <div className="fieldset">
                <RadioCheckbox
                  className="radio-button"
                  type="radio"
                  onChange={(value) => updateForm({ ...formData, stripe_product_id: value })}
                  options={instanceProducts}
                  value={formData.stripe_product_id || ''}
                  defaultValue={defaultValue}
                />
              </div>

              <Button
                onClick={() => updateForm({ ...formData, submitted: true, error: false })}
                title="Confirm Instance Details"
                block
                className="mt-3"
                color="purple"
              >
                Update Instance
              </Button>
            </>
          ) : (
            <i className="fa fa-spinner fa-spin text-purple" />
          )}
        </CardBody>
      </Card>
    </>
  );
};
