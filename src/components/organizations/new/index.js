import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, Input, Button, Row, Col, Card, CardBody } from 'reactstrap';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../state/appState';

import ContentContainer from '../../shared/contentContainer';
import handleAddOrg from '../../../methods/organizations/handleAddOrg';
import getUser from '../../../api/lms/getUser';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';

export default () => {
  const auth = useStoreState(appState, (s) => s.auth);
  const theme = useStoreState(appState, (s) => s.theme);
  const history = useHistory();
  const [formData, setFormData] = useState({});
  const [formState, setFormState] = useState({});
  const [showToolTip, setShowToolTip] = useState(false);

  const closeModal = () => history.push(`/`);

  useAsyncEffect(async () => {
    if (formState.submitted) {
      setShowToolTip(false);
      const newFormState = await handleAddOrg({ formData, auth });
      setFormState(newFormState);
      if (!newFormState.error) {
        await getUser(auth);
        closeModal();
      }
    }
  }, [formState]);

  useEffect(() => {
    if (!formState.submitted) setFormState({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return (
    <Modal id="new-org-modal" isOpen className={theme}>
      <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
        {formState.submitted ? (
          <ModalBody>
            <Card>
              <CardBody>
                <div className="p-4 text-center">
                  <b>Creating Your Organizaation</b>
                  <br />
                  <br />
                  <br />
                  <i className="fa fa-lg fa-spinner fa-spin text-purple mb-4" />
                  <br />
                  <br />
                  The Organization Otterhound is fetching your stuff.
                </div>
              </CardBody>
            </Card>
          </ModalBody>
        ) : formState.success ? (
          <ModalBody>
            <Card>
              <CardBody>
                <div className="p-4 text-center">
                  <b>Success</b>
                  <br />
                  <br />
                  <br />
                  <i className="fa fa-lg fa-thumbs-up text-purple mb-4" />
                  <br />
                  <br />
                  Your organization was created successfully.
                </div>
              </CardBody>
            </Card>
          </ModalBody>
        ) : (
          <>
            <ModalHeader toggle={closeModal}>Add New Organization</ModalHeader>
            <ModalBody>
              <Card className="mb-3">
                <CardBody>
                  <ContentContainer header="Name">
                    <Row>
                      <Col sm="4" className="pt-2 text-nowrap text-grey">
                        Ex: &quot;My Org&quot;
                      </Col>
                      <Col sm="8">
                        <Input className="text-center" onChange={(e) => setFormData({ ...formData, org: e.target.value })} type="text" title="name" value={formData.org || ''} />
                      </Col>
                    </Row>
                  </ContentContainer>
                  <ContentContainer header="Subdomain" subheader="alphanumeric and hyphens only. 16 char max.">
                    <Row>
                      <Col sm="4" className="pt-2 text-nowrap text-grey">
                        Ex: &quot;myorg&quot;&nbsp;
                        <i className="fa fa-question-circle text-purple" onClick={() => setShowToolTip(!showToolTip)} />
                      </Col>
                      <Col sm="8">
                        <Input
                          className="text-center"
                          type="text"
                          title="subdomain"
                          value={formData.subdomain || ''}
                          disabled={formState.submitted}
                          onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.substring(0, 15).toLowerCase() })}
                        />
                      </Col>
                    </Row>
                    {showToolTip && (
                      <div className="text-center pt-2 pb-1 text-lightpurple text-small">
                        <i>Part of the URL of your HarperDB Cloud Instances- see below.</i>
                      </div>
                    )}
                    <hr className="my-2 d-none d-sm-block" />
                    <Row>
                      <Col xs="12" className="pt-2 text-center text-nowrap overflow-hidden text-truncate">
                        {formData.subdomain ? (
                          <i className="text-grey">INSTANCE_NAME-{formData.subdomain}.harperdbcloud.com</i>
                        ) : (
                          <span className="text-lightgrey">INSTANCE_NAME-SUBDOMAIN.harperdbcloud.com</span>
                        )}
                      </Col>
                    </Row>
                  </ContentContainer>
                </CardBody>
              </Card>
              <Button onClick={() => setFormState({ submitted: true })} title="Create Organization" block className="mt-3" color="purple">
                Create Organization
              </Button>
              {formState.error && (
                <Card className="mt-3 error">
                  <CardBody>{formState.error}</CardBody>
                </Card>
              )}
            </ModalBody>
          </>
        )}
      </ErrorBoundary>
    </Modal>
  );
};
