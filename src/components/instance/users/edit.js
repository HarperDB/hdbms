import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CardBody, Card, Button } from '@nio/ui-kit';
import { useHistory } from 'react-router';

import Password from './editPassword';
import Role from './editRole';
import Delete from './editDelete';

export default () => {
  const { username } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();

  return (
    <>
      <div className="floating-card-header">
        existing users &gt; edit <b>{username}</b>
      </div>
      <Card className="my-3">
        <CardBody>
          <Password />
          <hr />
          <Role />
          <hr />
          <Delete />
          <hr />
          <Button block color="grey" onClick={() => history.push(pathname.replace(`/${username}`, ''))}>
            cancel
          </Button>
        </CardBody>
      </Card>
    </>
  );
};
