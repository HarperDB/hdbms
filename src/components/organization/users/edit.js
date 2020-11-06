import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CardBody, Card, Button, Col, Row } from 'reactstrap';
import { useHistory } from 'react-router';

import Role from './editRole';
import Delete from './editDelete';

const Edit = ({ userEmail }) => {
  const { user_id } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();

  return (
    <>
      <div className="floating-card-header">
        existing users &gt; edit &gt; <b>{userEmail}</b>
      </div>
      <Card className="my-3">
        <CardBody>
          <Role />
          <hr className="my-3" />
          <Delete />
          <hr className="my-3" />
          <Row>
            <Col xs="8" className="py-1">
              Return to User List
              <br />
              <span className="text-small">make no further changes to this user</span>
            </Col>
            <Col xs="4">
              <Button id="returnToOrganizationUserList" block color="grey" onClick={() => history.push(pathname.replace(`/${user_id}`, ''))}>
                Return to User List
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default Edit;
