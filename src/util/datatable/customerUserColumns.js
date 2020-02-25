import React from 'react';
import { Button } from '@nio/ui-kit';

import removeUser from '../../api/lms/removeUser';

const toggleCellPadding = { paddingTop: 3, paddingBottom: 0, paddingLeft: 0, paddingRight: 2 };

export default ({ auth, customer_id, setLastUpdate }) => [{
  Header: 'last name',
  accessor: 'lastname',
  style: { paddingTop: 10 },
}, {
  Header: 'first name',
  accessor: 'firstname',
  style: { paddingTop: 10 },
}, {
  Header: 'email',
  accessor: 'email',
  style: { paddingTop: 10 },
}, {
  Header: '',
  Cell: ({
    original: { user_id },
  }) => (
    <Button color="danger" className="connect" block onClick={() => removeUser({ auth, user_id, customer_id, setLastUpdate })}>delete</Button>),
  width: 80,
  style: toggleCellPadding,
}];
