import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CardBody, Card, Button, Col, Row } from 'reactstrap';
import { useHistory } from 'react-router';

import Password from './editPassword';
import Role from './editRole';
import Delete from './editDelete';
import ContentContainer from '../../shared/contentContainer';

export default () => {
  const { username } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();

  return (
    <>
      <div className="floating-card-header">
        existing users &gt; edit &gt; <b>{username}</b>
      </div>
      <Card className="my-3">
        <CardBody>
          <Row>
            <Col xl="4">
              <Card className="mb-3">
                <CardBody>
                  <ContentContainer header="Password" subheader="must restart instance">
                    <Password />
                  </ContentContainer>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="mb-3">
                <CardBody>
                  <ContentContainer header="Role">
                    <Role />
                  </ContentContainer>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="mb-3">
                <CardBody>
                  <ContentContainer header="Delete User">
                    <Delete />
                  </ContentContainer>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Button block color="grey" onClick={() => history.push(pathname.replace(`/${username}`, ''))}>
            cancel
          </Button>
        </CardBody>
      </Card>
    </>
  );
};
