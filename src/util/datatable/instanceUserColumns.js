import React from 'react';
import { Button } from '@nio/ui-kit';

const buttonCellPadding = {
  paddingTop: 3,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 10,
};

export default ({ auth, setModal }) => [
  {
    Header: 'username',
    accessor: 'username',
    style: { paddingTop: 10 },
  },
  {
    Header: 'role',
    accessor: 'role.role',
    style: { paddingTop: 10 },
  },
  {
    Header: '',
    Cell: ({
      original: {
        username,
        role: {
          id,
          permission: { cluster_user, super_user },
        },
      },
    }) =>
      auth.user !== username && !cluster_user && !super_user ? (
        <Button
          color="darkpurple"
          className="datatable"
          block
          onClick={() =>
            setModal({
              action: 'role',
              username,
              role: id,
            })
          }
        >
          edit role
        </Button>
      ) : null,
    width: 90,
    style: buttonCellPadding,
  },
  {
    Header: '',
    Cell: ({ original: { username } }) =>
      auth.user !== username ? (
        <Button
          color="purple"
          className="datatable"
          block
          onClick={() =>
            setModal({
              action: 'password',
              username,
            })
          }
        >
          edit password
        </Button>
      ) : null,
    width: 90,
    style: buttonCellPadding,
  },
  {
    Header: '',
    Cell: ({ original: { username } }) =>
      auth.user !== username ? (
        <Button
          color="danger"
          className="datatable"
          block
          onClick={() =>
            setModal({
              action: 'delete',
              username,
            })
          }
        >
          delete user
        </Button>
      ) : null,
    width: 90,
    style: buttonCellPadding,
  },
];
