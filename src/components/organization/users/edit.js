import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CardBody, Card, Button, Col, Row } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';

import Role from './editRole';
import Delete from './editDelete';
import ContentContainer from '../../shared/contentContainer';
import addError from '../../../api/lms/addError';
import ErrorFallback from '../../shared/errorFallback';

export default ({ userEmail }) => {
  const { user_id, customer_id } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();

  return (
    <>
      <div className="floating-card-header">
        existing users &gt; edit &gt; <b>{userEmail}</b>
      </div>
      <Card className="my-3">
        <CardBody>
          <Row>
            <Col lg="6">
              <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id })} FallbackComponent={ErrorFallback}>
                <Card className="mb-3">
                  <CardBody>
                    <ContentContainer header="Update User Role">
                      <Role />
                    </ContentContainer>
                  </CardBody>
                </Card>
              </ErrorBoundary>
            </Col>
            <Col lg="6">
              <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id })} FallbackComponent={ErrorFallback}>
                <Card className="mb-3">
                  <CardBody>
                    <ContentContainer header="Delete User">
                      <Delete />
                    </ContentContainer>
                  </CardBody>
                </Card>
              </ErrorBoundary>
            </Col>
          </Row>
          <Button block color="grey" onClick={() => history.push(pathname.replace(`/${user_id}`, ''))}>
            cancel
          </Button>
        </CardBody>
      </Card>
    </>
  );
};
