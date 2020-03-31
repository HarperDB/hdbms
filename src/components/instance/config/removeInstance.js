import React, { useState } from 'react';
import { Button, Card, CardBody, Input } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';

import instanceState from '../../../state/stores/instanceState';
import ContentContainer from '../../shared/contentContainer';
import appState from '../../../state/stores/appState';

export default ({ setRemovingInstance }) => {
  const cloudInstancesBeingModified = useStoreState(appState, (s) => s.instances.filter((i) => !i.is_local && !['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(i.status)).length);
  const { compute_stack_id, instance_name, is_local } = useStoreState(instanceState, (s) => ({
    compute_stack_id: s.compute_stack_id,
    instance_name: s.instance_name,
    is_local: s.is_local,
  }));
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({});

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { delete_instance_name } = formData;

      if (instance_name !== delete_instance_name) {
        setFormState({ error: 'instance name is not correct' });
      } else {
        setRemovingInstance(compute_stack_id);
      }
    }
  }, [formState]);

  useAsyncEffect(() => {
    if (!is_local && cloudInstancesBeingModified) {
      setFormState({ error: 'another cloud instance is being modified. please wait.' });
    }
  }, [formData]);

  return (
    <>
      <span className="text-white mb-2 floating-card-header">remove instance</span>
      <Card className="my-3">
        <CardBody>
          {formState.error ? (
            <Card className="mt-2 error">
              <CardBody className="text-danger text-small text-center">
                {formState.error}
              </CardBody>
            </Card>
          ) : (
            <>
              <ContentContainer header={`Enter "${instance_name}" below to begin.`}>
                <Input
                  onChange={(e) => updateForm({ delete_instance_name: e.target.value })}
                  type="text"
                  title="instance_name"
                  value={formData.instance_name}
                />
              </ContentContainer>

              {formData.delete_instance_name === instance_name && (
                <>
                  <Button
                    onClick={() => setFormState({ submitted: true })}
                    title="Confirm Instance Details"
                    block
                    disabled={formState.submitted}
                    className="mt-1"
                    color="danger"
                  >
                    Remove Instance
                  </Button>

                  <hr className="mt-1" />

                  {is_local ? (
                    <ul className="text-small">
                      <li><b>DOES NOT</b> uninstall HarperDB.</li>
                      <li><b>DOES</b> leave all your data intact.</li>
                      <li>REMOVES your instance license.</li>
                      <li>STOPS recurring license charges.</li>
                      <li>LIMITS instance to 1GB RAM.</li>
                      <li>REMOVES instance from the Studio.</li>
                      <li>RESTARTS the instance.</li>
                    </ul>
                  ) : (
                    <ul className="text-small">
                      <li><b>THIS IS</b> an irreversible process.</li>
                      <li><b>IT CANNOT</b> be undone.</li>
                      <li>DELETES your instance completely.</li>
                      <li>STOPS recurring license charges.</li>
                      <li>REMOVES instance from the Studio.</li>
                    </ul>
                  )}
                </>
              )}
            </>
          )}
        </CardBody>
      </Card>
      <br />
    </>
  );
};
