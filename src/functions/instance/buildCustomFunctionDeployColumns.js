import React from 'react';
import { Button } from 'reactstrap';

import deployCustomFunctionProject from '../api/instance/deployCustomFunctionProject';
import dropCustomFunctionProject from '../api/instance/dropCustomFunctionProject';

export default ({ project, payload, file, loading, instanceAuths }) => [
  {
    Header: 'instance name',
    accessor: 'instance_name',
  },
  {
    Header: 'instance url',
    accessor: 'url',
  },
  {
    Header: 'version',
    id: 'hdb-narrow-version',
    Cell: ({
      row: {
        original: { compute_stack_id },
      },
    }) => instanceAuths[compute_stack_id].version,
  },
  {
    Header: 'deploy',
    id: 'hdb-narrow-deploy',
    Cell: ({
      row: {
        original: { compute_stack_id, url },
      },
    }) => (
      <Button
        color="success"
        block
        size="sm"
        disabled={loading || !instanceAuths[compute_stack_id]}
        onChange={async () => {
          await deployCustomFunctionProject({
            auth: instanceAuths[compute_stack_id],
            url,
            payload,
            project,
            file,
          });
        }}
      >
        <i className={`fa ${loading || !instanceAuths[compute_stack_id] ? 'fa-spinner fa-spin' : 'fa-share'}`} />
      </Button>
    ),
  },
  {
    Header: 'remove',
    id: 'hdb-narrow-remove',
    Cell: ({
      row: {
        original: { compute_stack_id, url },
      },
    }) => (
      <Button
        color="danger"
        block
        size="sm"
        disabled={!instanceAuths[compute_stack_id]}
        onChange={async () => {
          await dropCustomFunctionProject({
            auth: instanceAuths[compute_stack_id],
            url,
            project,
          });
        }}
      >
        <i className="fa fa-trash" />
      </Button>
    ),
  },
];
