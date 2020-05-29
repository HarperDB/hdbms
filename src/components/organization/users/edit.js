import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CardBody, Card, Button, Col, Row } from '@nio/ui-kit';
import { useHistory } from 'react-router';

import Role from './editRole';
import Delete from './editDelete';
import ContentContainer from '../../shared/contentContainer';

export default () => {
  const { user_id } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();

  return (
    <>
      <div className="floating-card-header">
        existing users &gt; edit <b>{user_id}</b>
      </div>
      <Card className="my-3">
        <CardBody>
          <Row>
            <Col lg="6">
              <ContentContainer header="Role" className="mb-4">
                <Role />
              </ContentContainer>
            </Col>
            <Col lg="6">
              <ContentContainer header="Delete User" className="mb-4">
                <Delete />
              </ContentContainer>
            </Col>
          </Row>
          <hr className="mt-0 mb-4" />
          <Button block color="grey" onClick={() => history.push(pathname.replace(`/${user_id}`, ''))}>
            cancel
          </Button>
        </CardBody>
      </Card>
    </>
  );
};
