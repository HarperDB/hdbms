import React from 'react';
import { Button } from '@nio/ui-kit';



const toggleCellPadding = { paddingTop: 3, paddingBottom: 0, paddingLeft: 0, paddingRight: 2 };

export default ({ deleteUser }) => [{
  Header: 'username',
  accessor: 'username',
  style: { paddingTop: 10 },
}, {
  Header: 'role',
  accessor: 'role.role',
  style: { paddingTop: 10 },
}, {
  Header: '',
  Cell: ({
    original: { username },
  }) => (
    <Button color="danger" className="connect" block onClick={() => deleteUser({ username })}>delete</Button>),
  width: 80,
  style: toggleCellPadding,
}];
