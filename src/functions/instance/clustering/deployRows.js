import React from 'react';
import { Button } from 'reactstrap';
export default ({
  initializing,
  loading,
  handleClick
}) => [{
  Header: 'instance name',
  accessor: 'instance_name'
}, {
  Header: 'instance url',
  accessor: 'url'
}, {
  Header: 'cf capable',
  id: 'hdb-narrow-cfcapable',
  Cell: ({
    row: {
      original: {
        customFunctionsStatus
      }
    }
  }) => customFunctionsStatus.error ? 'no' : 'yes'
}, {
  Header: 'cf enabled',
  id: 'hdb-narrow-cfenabled',
  Cell: ({
    row: {
      original: {
        customFunctionsStatus
      }
    }
  }) => customFunctionsStatus.isEnabled ? 'yes' : 'no'
}, {
  Header: 'has project',
  id: 'hdb-narrow-cfhasproject',
  Cell: ({
    row: {
      original: {
        hasCurrentProject
      }
    }
  }) => hasCurrentProject ? 'yes' : 'no'
}, {
  Header: 'deploy',
  id: 'hdb-narrow-deploy',
  Cell: ({
    row: {
      original: {
        computeStackId,
        customFunctionsStatus,
        hasAuth
      }
    }
  }) => customFunctionsStatus.isEnabled && hasAuth ? <Button color="success" block size="sm" disabled={initializing || loading[computeStackId]} onClick={() => handleClick(computeStackId, 'deploy')}>
          <i className={`fa ${loading[computeStackId] === 'deploy' ? 'fa-spinner fa-spin' : 'fa-share'}`} />
        </Button> : null
}, {
  Header: 'remove',
  id: 'hdb-narrow-remove',
  Cell: ({
    row: {
      original: {
        computeStackId,
        customFunctionsStatus,
        hasCurrentProject,
        hasAuth
      }
    }
  }) => customFunctionsStatus.isEnabled && hasCurrentProject && hasAuth ? <Button color="danger" block size="sm" disabled={loading[computeStackId]} onClick={() => handleClick(computeStackId, 'drop')}>
          <i className={`fa ${loading[computeStackId] === 'drop' ? 'fa-spinner fa-spin' : 'fa-trash'}`} />
        </Button> : null
}];