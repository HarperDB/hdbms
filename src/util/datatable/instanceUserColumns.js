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
  Header: 'cluster user',
  accessor: 'role.permission.cluster_user',
  style: { paddingTop: 10 },
  Cell: ({ original: { role: { permission: { cluster_user } } } }) => (cluster_user ? 'yes' : 'no'),
}, {
  Header: 'super user',
  accessor: 'role.permission.super_user',
  style: { paddingTop: 10 },
  Cell: ({ original: { role: { permission: { super_user } } } }) => (super_user ? 'yes' : 'no'),
}, {
  Header: '',
  Cell: ({
    original: { username },
  }) => (
    <Button color="danger" className="connect" block onClick={() => deleteUser({ username })}>delete</Button>),
  width: 80,
  style: toggleCellPadding,
}];
