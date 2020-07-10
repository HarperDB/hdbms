import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Button, CardBody, Card } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../state/appState';

import updateUser from '../../../api/lms/updateUser';
import FormStatus from '../../shared/formStatus';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';

export default ({ formStateHeight }) => {
  const auth = useStoreState(appState, (s) => s.auth);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState(auth);

  const submit = () => {
    setFormState({ submitted: true });
    const { firstname, lastname } = formData;
    if (!firstname || !lastname) {
      setFormState({ error: 'All fields are required' });
    } else if (auth.firstname === firstname && auth.lastname === lastname) {
      setFormState({ error: 'Nothing seems to have changed' });
    } else {
      setFormState({ processing: true });
      updateUser({ auth, firstname, lastname, user_id: auth.user_id });
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted && auth?.profileError) {
      setFormState({ error: auth.message });
    } else if (mounted && auth?.profileSuccess) {
      setFormState({ success: auth.message });
    }
    return () => {
      mounted = false;
    };
  }, [auth.profileError, auth.profileSuccess]);

  useEffect(() => {
    let mounted = true;
    if (formState.error || formState.success) {
      setTimeout(() => {
        if (mounted) setFormState({});
      }, 2000);
    }
    return () => {
      mounted = false;
    };
  }, [formState.error, formState.success]);

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
      {' '}
      {formState.processing ? (
        <FormStatus height={formStateHeight} status="processing" header="Updating Profile" subhead="The Profile Poodle is doing his thing." />
      ) : formState.success ? (
        <FormStatus height={formStateHeight} status="success" header="Success!" subhead={formState.success} />
      ) : formState.error ? (
        <FormStatus height={formStateHeight} status="error" header={formState.error} subhead="Please try again" />
      ) : (
        <>
          <Card className="mb-3">
            <CardBody>
              <Row>
                <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
                  first name
                </Col>
                <Col md="6" xs="12">
                  <Input
                    type="text"
                    className="mb-0 text-center"
                    name="fname"
                    placeholder="first name"
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                    value={formData.firstname || ''}
                    disabled={formState.submitted}
                  />
                </Col>
                <Col xs="12">
                  <hr className="my-2" />
                </Col>
                <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
                  last name
                </Col>
                <Col md="6" xs="12">
                  <Input
                    type="text"
                    className="mb-0 text-center"
                    name="lname"
                    placeholder="last name"
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    value={formData.lastname || ''}
                    disabled={formState.submitted}
                  />
                </Col>
                <Col xs="12">
                  <hr className="my-2" />
                </Col>
                <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
                  email address (not editable)
                </Col>
                <Col md="6" xs="12">
                  <div className="fake-input text-center">{auth.email}</div>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Button color="purple" block onClick={submit} disabled={formState.submitted}>
            Save Profile
          </Button>
        </>
      )}{' '}
    </ErrorBoundary>
  );
};
