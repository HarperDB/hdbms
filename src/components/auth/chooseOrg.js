import React, { useState } from 'react';
import { Card, CardBody, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';

import appState from '../../state/appState';
import getCustomer from '../../api/lms/getCustomer';
import usePersistedLMSAuth from '../../state/persistedLMSAuth';

export default () => {
  const auth = useStoreState(appState, (s) => s.auth);
  const [persistedLMSAuth, setPersistedLMSAuth] = usePersistedLMSAuth({});
  const [formState, setFormState] = useState({ loading: true });
  const history = useHistory();
  const { search } = useLocation();
  const { returnURL } = queryString.parse(search);
  const acceptedOrgs = auth.orgs?.filter((o) => o.status === 'accepted');

  useAsyncEffect(async () => {
    const { submitted, customer_id } = formState;
    if (submitted && customer_id) {
      setPersistedLMSAuth({ ...persistedLMSAuth, customer_id });
      await getCustomer({ auth, customer_id });
      setTimeout(() => history.push(returnURL || '/instances'), 0);
    }
  }, [formState]);

  useAsyncEffect(async () => {
    if (persistedLMSAuth.customer_id) {
      setFormState({ submitted: true, customer_id: persistedLMSAuth.customer_id });
    } else if (!auth.orgs) {
      setFormState({ submitted: true, customer_id: auth.customer_id });
    } else if (auth.orgs.length === 1) {
      setFormState({ submitted: true, customer_id: auth.orgs[0].customer_id });
    } else {
      setFormState({});
    }
  }, [auth.orgs, persistedLMSAuth.customer_id]);

  return (
    <div id="login-form">
      <div id="login-logo" title="HarperDB Logo" />
      {formState.submitted || formState.loading ? (
        <>
          <Card className="mb-3">
            <CardBody className="text-white text-center">
              loading instances
              <br />
              <br />
              <i className="fa fa-spinner fa-spin text-white" />
            </CardBody>
          </Card>
          <div className="login-nav-link">&nbsp;</div>
        </>
      ) : (
        <>
          <Card className="mb-3">
            <CardBody className="text-white text-center">
              {acceptedOrgs && (
                <>
                  Choose An Organization
                  <hr />
                  {acceptedOrgs.map((org) => (
                    <Button
                      key={org.customer_id}
                      onClick={() => setFormState({ submitted: true, ...org })}
                      disabled={formState.submitted}
                      title={`Select ${org.customer_name}`}
                      block
                      color="purple"
                    >
                      {org.customer_name}
                    </Button>
                  ))}
                </>
              )}
            </CardBody>
          </Card>
          <div className="login-nav-link">&nbsp;</div>
        </>
      )}
    </div>
  );
};
