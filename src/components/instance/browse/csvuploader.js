import React, { useState, useCallback } from 'react';
import { Button, Card, CardBody, Col, Input, Row } from '@nio/ui-kit';
import { useHistory, useParams } from 'react-router';
import { useStoreState } from 'pullstate';
import { useDropzone } from 'react-dropzone';
import useAsyncEffect from 'use-async-effect';

import instanceState from '../../../state/stores/instanceState';
import config from '../../../../config';

import getJob from '../../../api/instance/getJob';
import csvDataLoad from '../../../api/instance/csvDataLoad';
import commaNumbers from '../../../util/commaNumbers';
import isURL from '../../../util/isURL';
import csvURLLoad from '../../../api/instance/csvURLLoad';
import tableState from '../../../state/stores/tableState';

export default () => {
  const history = useHistory();
  const { schema, table } = useParams();
  const { compute_stack_id, auth, url } = useStoreState(instanceState, (s) => ({
    compute_stack_id: s.compute_stack_id,
    auth: s.auth,
    url: s.url,
  }));
  const currentHash = useStoreState(tableState, (s) => s.currentHash);

  const [uploadStatus, setUploadStatus] = useState(false);
  const [processedData, setProcessedData] = useState(false);
  const [newRecordCount, setNewRecordCount] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const [formState, setFormState] = useState({});
  const [mounted, setMounted] = useState(false);

  // query the table to determine if all the records have been processed.
  const validateData = async (uploadJobId) => {
    const [{ status, message, type }] = await getJob({ auth, url, id: uploadJobId });

    if (status === 'ERROR' && type === 'csv_url_load') {
      return setFormState({ error: message.split(':')[1] });
    }

    if (status === 'ERROR' && message.indexOf('transaction aborted due to record(s) with a hash value that contains a forward slash') !== -1) {
      return setFileError('The CSV file contains a row with a forward slash in the hash field.');
    }

    if (status === 'ERROR') {
      return setFileError(message);
    }

    if (status !== 'COMPLETE' && mounted) {
      return setTimeout(() => validateData(uploadJobId), 2000);
    }

    instanceState.update((s) => {
      s.lastUpdate = Date.now();
    });
    return setTimeout(() => {
      history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}`);
    }, 1000);
  };

  // insert the processed data into HarperDB
  const insertData = async () => {
    if (!processedData) return false;
    setUploadStatus('inserting');
    const uploadJob = await csvDataLoad({
      schema,
      table,
      data: processedData,
      auth,
      url,
    });
    const uploadJobId = uploadJob.message.replace('Starting job with id ', '');
    setProcessedData(false);
    return setTimeout(() => validateData(uploadJobId), 1000);
  };

  // after they've selected/dropped the file, send it to the worker
  const processData = (data) => {
    setUploadStatus('processing');
    const lines = data.match(/\r?\n/g);
    setNewRecordCount(lines.length - 1);
    setProcessedData(data);
    setUploadStatus('processed');
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => setFileError('File reading was aborted');
      reader.onerror = () => setFileError('file reading has failed');
      reader.onload = () => {
        processData(reader.result);
      };
      if (file.size > config.max_file_upload_size) {
        setFileError('File exceeds 10MB Limit. Use URL Loader Above.');
      } else {
        reader.readAsText(file);
      }
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleClear = () => {
    setProcessedData(false);
    setFileError(false);
    setUploadStatus(false);
  };

  const handleCancel = () => {
    setProcessedData(false);
    setFileError(false);
    setUploadStatus(false);
    history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}`);
  };

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { csv_url } = formData;
      if (isURL(csv_url)) {
        const uploadJob = await csvURLLoad({ schema, table, csv_url, auth, url });
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

  console.log(fileError);

  return (
    <>
      <span className="text-white mb-2 floating-card-header">
        {schema} &gt; {table} &gt; csv upload
      </span>
      <Card className="my-3">
        <CardBody>
          <Row>
            <Col sm="6" className="mb-2">
              <b className="text-small">Specify A Hosted CSV File</b>
              <hr className="my-1" />
              {formState.error ? (
                <div className="text-danger csv-status">
                  <i className="fa fa-exclamation-triangle mr-3" />
                  {formState.error}
                </div>
              ) : formState.submitted ? (
                <div className="csv-status">
                  <i className="fa fa-spin fa-spinner mr-3" />
                  uploading .csv into {schema}.{table}
                </div>
              ) : (
                <Input
                  onChange={(e) =>
                    setFormData({
                      csv_url: e.target.value,
                    })
                  }
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
                  <Button block color="danger" onClick={() => setFormState({})}>
                    Clear URL
                  </Button>
                ) : (
                  <Button
                    disabled={formState.submitted || !isURL(formData.csv_url)}
                    block
                    color="success"
                    onClick={() => setFormState({ submitted: true })}
                  >
                    Import From URL
                  </Button>
                )}
              </div>
            </Col>
            <Col sm="6">
              <b className="text-small">Upload A CSV FIle (10MB Limit)</b>
              <hr className="my-1" />
              {fileError ? (
                <div className="text-danger csv-status">{fileError}</div>
              ) : uploadStatus === 'inserting' ? (
                <div className="csv-status">
                  <i className="fa fa-spin fa-spinner mr-3" />
                  inserting {commaNumbers(newRecordCount)} records into {schema}.{table}
                </div>
              ) : uploadStatus === 'processed' ? (
                <div className="csv-status" onClick={handleClear}>
                  <i className="fa fa-thumbs-up text-success mr-3" />
                  {commaNumbers(newRecordCount)} records. Click here to replace file.
                </div>
              ) : uploadStatus === 'processing' ? (
                <div className="csv-status">
                  <i className="fa fa-spin fa-spinner" /> processing {commaNumbers(newRecordCount)} records
                </div>
              ) : (
                <div {...getRootProps()} className="text-center">
                  <input {...getInputProps()} />
                  <Button className="no-shadow" disabled={formState.submitted} color="grey" outline block>
                    Click to select a .csv file
                  </Button>
                </div>
              )}
              <div className="pt-2">
                {fileError ? (
                  <Button color="danger" block className="px-5 clear-files" onClick={handleClear}>
                    Clear File
                  </Button>
                ) : uploadStatus === 'inserting' ? (
                  <Button block color="black" onClick={handleCancel}>
                    Return to Table View (Insert Runs in Background)
                  </Button>
                ) : (
                  <Button block disabled={[false, 'inserting', 'processing'].includes(uploadStatus)} color="success" onClick={insertData}>
                    Insert {commaNumbers(newRecordCount)} Records
                  </Button>
                )}
              </div>
            </Col>
          </Row>
          <hr className="mt-2 mb-4" />
          <Button block disabled={['inserting', 'processing'].includes(uploadStatus) || formState.submitted} color="black" onClick={handleCancel}>
            Cancel
          </Button>
        </CardBody>
      </Card>
    </>
  );
};
