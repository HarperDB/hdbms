import React from 'react';

export default ({ current_user_id }) => [
  {
    Header: 'email address',
    accessor: 'email',
    Cell: ({ original: { user_id, email } }) => <div className={current_user_id !== user_id ? '' : 'text-grey'}>{email}</div>,
  },
  {
    Header: 'status',
    accessor: 'orgs[0].status',
    Cell: ({ original: { user_id, orgs } }) => <div className={current_user_id !== user_id ? '' : 'text-grey'}>{orgs[0].status}</div>,
  },
];
