import React, { useCallback, useState } from 'react';
import { Button, Input } from '@nio/ui-kit';
import { useHistory, useParams } from 'react-router';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';

import instanceState from '../../../state/instanceState';

import getJob from '../../../api/instance/getJob';
import isURL from '../../../methods/util/isURL';
import csvURLLoad from '../../../api/instance/csvURLLoad';

export default () => {
  const history = useHistory();
  const { schema, table } = useParams();
  const { compute_stack_id, auth, url } = useStoreState(instanceState, (s) => ({ compute_stack_id: s.compute_stack_id, auth: s.auth, url: s.url }));
  const [formData, setFormData] = useState({});
  const [formState, setFormState] = useState({});
  const [mounted, setMounted] = useState(false);

  const validateData = useCallback(
    async (uploadJobId) => {
      const [{ status, message }] = await getJob({ auth, url, id: uploadJobId });
      if (status === 'ERROR') {
        if (['Error: CSV Load failed from URL', 'Error downloading CSV file'].some((i) => message.indexOf(i) !== -1)) {
          return setFormState({ error: 'The URL did not return a valid csv file' });
        }
        return setFormState({ error: message.split(':')[1] });
      }
      if (status !== 'COMPLETE' && mounted) {
        return setTimeout(() => validateData(uploadJobId), 2000);
      }
      instanceState.update((s) => {
        s.lastUpdate = Date.now();
      });
      return setTimeout(() => history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}`), 1000);
    },
    [mounted]
  );

  useAsyncEffect(async () => {
    if (formState.submitted) {
      if (isURL(formData.csv_url)) {
        setFormState({ uploading: true });
        const uploadJob = await csvURLLoad({ schema, table, csv_url: formData.csv_url, auth, url });
        const uploadJobId = uploadJob.message.replace('Starting job with id ', '');
        setTimeout(() => validateData(uploadJobId), 1000);
      } else {
        setFormState({ error: 'Please provide a valid URL' });
        setTimeout(() => setFormState({}), 2000);
      }
    }
  }, [formState]);

  useAsyncEffect(
    () => setMounted(true),
    () => setMounted(false),
    []
  );

  return (
    <>
      <b className="text-small">Specify A Hosted CSV File</b>
      <hr className="my-1" />
      {formState.error ? (
        <div className="text-danger csv-status">
          <i className="fa fa-exclamation-triangle mr-3" />
          {formState.error}
        </div>
      ) : formState.uploading ? (
        <div className="csv-status">
          <i className="fa fa-spin fa-spinner mr-3" />
          uploading .csv into {schema}.{table}
        </div>
      ) : (
        <Input
          onChange={(e) => setFormData({ csv_url: e.target.value })}
          type="text"
          invalid={formData.csv_url && !isURL(formData.csv_url)}
          title="instance_name"
          placeholder="CSV file URL"
          value={formData.csv_url || ''}
          disabled={formState.submitted}
        />
      )}
      <div className="pt-2">
        {formState.error ? (
          <Button
            block
            color="danger"
            onClick={() => {
              setFormState({});
              setFormData({});
            }}
          >
            Clear URL
          </Button>
        ) : (
          <Button disabled={!!Object.keys(formState).length || !isURL(formData.csv_url)} block color="success" onClick={() => setFormState({ submitted: true })}>
            Import From URL
          </Button>
        )}
      </div>
    </>
  );
};
