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
    Header: 'capable',
    id: 'hdb-narrow-cfcapable',
    Cell: ({
      row: {
        original: { custom_functions_status },
      },
    }) => (custom_functions_status.error ? 'no' : 'yes'),
  },
  {
    Header: 'enabled',
    id: 'hdb-narrow-cfenabled',
    Cell: ({
      row: {
        original: { custom_functions_status },
      },
    }) => (custom_functions_status.is_enabled ? 'yes' : 'no'),
  },
  {
    Header: 'deploy',
    id: 'hdb-narrow-deploy',
    Cell: ({
      row: {
        original: { compute_stack_id, url, custom_functions_status },
      },
    }) =>
      custom_functions_status.is_enabled ? (
        <Button
          color="success"
          block
          size="sm"
          disabled={loading || !instanceAuths[compute_stack_id] || !custom_functions_status.is_enabled}
          onClick={() =>
            deployCustomFunctionProject({
              auth: instanceAuths[compute_stack_id],
              url,
              payload,
              project,
              file,
            })
          }
        >
          <i className={`fa ${loading || !instanceAuths[compute_stack_id] ? 'fa-spinner fa-spin' : 'fa-share'}`} />
        </Button>
      ) : null,
  },
  {
    Header: 'remove',
    id: 'hdb-narrow-remove',
    Cell: ({
      row: {
        original: { compute_stack_id, url, custom_functions_status },
      },
    }) =>
      custom_functions_status.is_enabled ? (
        <Button
          color="danger"
          block
          size="sm"
          disabled={!instanceAuths[compute_stack_id] || !custom_functions_status.is_enabled}
          onClick={() =>
            dropCustomFunctionProject({
              auth: instanceAuths[compute_stack_id],
              url,
              project,
            })
          }
        >
          <i className="fa fa-trash" />
        </Button>
      ) : null,
  },
];
