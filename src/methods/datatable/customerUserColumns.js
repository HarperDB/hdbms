import React from 'react';
import { Button } from '@nio/ui-kit';

const toggleCellPadding = {
  paddingTop: 3,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 2,
};

export default ({ current_user_id, setUserToRemove }) => [
  {
    Header: 'last name',
    accessor: 'lastname',
    style: { paddingTop: 10 },
  },
  {
    Header: 'first name',
    accessor: 'firstname',
    style: { paddingTop: 10 },
  },
  {
    Header: 'email address',
    accessor: 'email',
    style: { paddingTop: 10 },
  },
  {
    Header: 'status',
    accessor: 'orgs[0].status',
    Cell: ({ original: { user_id, orgs } }) => current_user_id !== user_id && orgs[0].status,
    style: { paddingTop: 10 },
  },
  {
    Header: '',
    Cell: ({ original: { user_id } }) =>
      current_user_id !== user_id && (
        <Button color="danger" className="datatable" block onClick={() => setUserToRemove(user_id)}>
          remove
        </Button>
      ),
    width: 80,
    style: toggleCellPadding,
  },
];
