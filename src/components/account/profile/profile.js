import React, { useState } from 'react';
import { Row, Col, Input, Button, CardBody, Card } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';

import updateUser from '../../../api/lms/updateUser';
import getUser from '../../../api/lms/getUser';
import FormStatus from '../../shared/formStatus';

export default ({ formStateHeight }) => {
  const auth = useStoreState(appState, (s) => s.auth);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState(auth);

  useAsyncEffect(async () => {
    const { firstname, lastname, customer_id, user_id } = formData;
    const { submitted } = formState;
    if (submitted) {
      if (!firstname || !lastname) {
        setFormState({
          error: 'All fields are required',
        });
      } else if (auth.firstname === firstname && auth.lastname === lastname) {
        setFormState({
          error: 'Nothing seems to have changed',
        });
      } else {
        setFormState({
          processing: true,
        });

        const response = await updateUser({
          auth,
          payload: {
            firstname,
            lastname,
            customer_id,
            user_id,
          },
        });
        if (response.result === false) {
          setFormState({
            error: response.message,
          });
        } else {
          const user = await getUser({
            auth,
            payload: {
              email: auth.email,
            },
          });
          appState.update((s) => {
            s.auth = { ...auth, ...user };
          });
          setFormState({
            success: response.message,
          });
        }
      }
      setTimeout(() => setFormState({}), 2000);
    }
  }, [formState]);

  useAsyncEffect(() => setFormState({}), [formData]);

  return formState.processing ? (
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    firstname: e.target.value,
                  })
                }
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lastname: e.target.value,
                  })
                }
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
              <div className="fake-input">{auth.email}</div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Button
        color="purple"
        block
        onClick={() =>
          setFormState({
            submitted: true,
          })
        }
        disabled={formState.submitted}
      >
        Save Profile
      </Button>
    </>
  );
};
