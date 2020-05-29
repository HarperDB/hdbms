export default ({ current_user_id }) => [
  {
    Header: 'email address',
    accessor: 'email',
    style: { paddingTop: 10 },
  },
  {
    Header: 'status',
    accessor: 'orgs[0].status',
    Cell: ({ original: { user_id, orgs } }) => (current_user_id !== user_id ? orgs[0].status : 'me'),
    style: { paddingTop: 10 },
  },
];
