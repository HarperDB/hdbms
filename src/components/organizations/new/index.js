import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, Input, Button, Row, Col, Tooltip, Card, CardBody } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';

import appState from '../../../state/appState';
import themeState from '../../../state/themeState';
import ContentContainer from '../../shared/contentContainer';
import handleAddOrg from '../../../methods/organizations/handleAddOrg';
import getUser from '../../../api/lms/getUser';

export default () => {
  const auth = useStoreState(appState, (s) => s.auth);
  const [darkTheme] = themeState(false);
  const history = useHistory();
  const [formData, setFormData] = useState({});
  const [formState, setFormState] = useState({});
  const [showToolTip, setShowToolTip] = useState(false);

  const closeModal = () => history.push(`/organizations`);

  useAsyncEffect(async () => {
    if (formState.submitted) {
      const newFormState = await handleAddOrg({ formData, auth });
      setFormState(newFormState);
      if (!newFormState.error) {
        const response = await getUser(auth);
        appState.update((s) => {
          s.auth = { ...auth, ...response };
        });
        closeModal();
      }
    }
  }, [formState]);

  useEffect(() => {
    if (!formState.submitted) setFormState({});
  }, [formData]);

  return (
    <Modal id="new-org-modal" isOpen className={darkTheme ? 'dark' : ''}>
      <ModalHeader toggle={closeModal}>Add New Organization</ModalHeader>
      <ModalBody>
        {formState.submitted ? (
          <Card className="mb-3">
            <CardBody className="text-center">
              <div className="mb-3">creating your organization</div>
              <i className="fa fa-spinner fa-spin text-purple" />
            </CardBody>
          </Card>
        ) : formState.success ? (
          <Card className="mb-3">
            <CardBody>
              <div className="text-center">
                <div className="mb-3">success!</div>
                your organization was created successfully
              </div>
            </CardBody>
          </Card>
        ) : (
          <>
            <Card className="mb-3">
              <CardBody>
                <ContentContainer header="Organization Details">
                  <Row>
                    <Col xs="4" className="pt-2">
                      Name
                    </Col>
                    <Col xs="8">
                      <Input
                        onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                        type="text"
                        title="name"
                        placeholder="organization name"
                        value={formData.org || ''}
                      />
                    </Col>
                  </Row>
                  <hr className="my-2" />
                  <Row>
                    <Col xs="4" className="pt-2">
                      Subdomain
                    </Col>
                    <Col xs="8">
                      <Row>
                        <Col className="subdomain-form">
                          <Input
                            className="text-center"
                            type="text"
                            title="subdomain"
                            placeholder="subdomain"
                            value={formData.subdomain || ''}
                            disabled={formState.submitted}
                            onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.substring(0, 15) })}
                          />
                        </Col>
                        <Col className="subdomain-label text-darkgrey">
                          .harperdbcloud.com{' '}
                          <a id="subdomainHelp" onClick={() => setShowToolTip(!showToolTip)}>
                            <i className="fa fa-question-circle text-purple" />
                          </a>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </ContentContainer>
              </CardBody>
            </Card>
            <Button onClick={() => setFormState({ submitted: true })} title="Create Organization" block className="mt-3" color="purple">
              Create Organization
            </Button>
            <Tooltip isOpen={showToolTip} placement="top-end" target="subdomainHelp" className="subdomain-tooltip">
              The URL you will use to reach HarperDB Cloud Instances.
            </Tooltip>
            {formState.error && (
              <Card className="mt-3 error">
                <CardBody>{formState.error}</CardBody>
              </Card>
            )}
          </>
        )}
      </ModalBody>
    </Modal>
  );
};
