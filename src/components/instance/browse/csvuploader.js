import React, { useState, useCallback } from 'react';
import { Button, Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useHistory, useParams } from 'react-router';
import { useStoreState } from 'pullstate';
import { useDropzone } from 'react-dropzone';

import getJob from '../../../api/instance/getJob';
import csvDataLoad from '../../../api/instance/csvDataLoad';
import commaNumbers from '../../../util/commaNumbers';
import instanceState from '../../../state/stores/instanceState';

export default () => {
  const history = useHistory();
  const { schema, table } = useParams();
  const { compute_stack_id, auth, url } = useStoreState(instanceState, (s) => ({
    compute_stack_id: s.compute_stack_id,
    auth: s.auth,
    url: s.url,
  }));

  const [status, setStatus] = useState(false);
  const [processedData, setProcessedData] = useState(false);
  const [newRecordCount, setNewRecordCount] = useState(0);
  const [fileError, setFileError] = useState(false);

  // query the table to determine if all the records have been processed.
  const validateData = async (uploadJobId) => {
    const jobStatus = await getJob({ auth, url, id: uploadJobId });

    if (jobStatus !== 'COMPLETE') {
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
    setStatus('inserting');
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
    setStatus('processing');
    const lines = data.match(/\r?\n/g);
    setNewRecordCount(lines.length - 1);
    setProcessedData(data);
    setStatus('processed');
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => setFileError('file reading was aborted');
      reader.onerror = () => setFileError('file reading has failed');
      reader.onload = () => {
        processData(reader.result);
      };
      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleClear = () => {
    setProcessedData(false);
    setStatus(false);
  };

  const handleCancel = () => {
    setProcessedData(false);
    setStatus(false);
    history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}`);
  };

  return (
    <>
      <span className="text-white mb-2 floating-card-header">
        {schema} &gt;{table} &gt; csv upload
      </span>
      <Card className="my-3">
        <CardBody>
          <Card className="mb-1">
            <CardBody className="csv-uploader">
              <div className="csv-message">
                {status === 'inserting' ? (
                  <div className="text-purple text-center">
                    <i className="fa fa-lg fa-spin fa-spinner" />
                    <div className="mt-3">
                      inserting {commaNumbers(newRecordCount)} records into {schema}.{table}
                    </div>
                  </div>
                ) : status === 'processed' ? (
                  <div className="text-purple text-center">
                    <i className="fa fa-lg fa-check-circle" />
                    <div className="my-3">successfully prepared {commaNumbers(newRecordCount)} records</div>
                    <Button color="purple" className="px-5 clear-files" onClick={handleClear}>
                      replace file
                    </Button>
                  </div>
                ) : status === 'processing' ? (
                  <div className="text-purple text-center">
                    <i className="fa fa-spin fa-spinner" />
                    <div className="mt-3">pre-processing {commaNumbers(newRecordCount)} records</div>
                  </div>
                ) : fileError ? (
                  <div className="text-danger text-center">{fileError}</div>
                ) : (
                  <div {...getRootProps()} id="csv-input" className="text-center">
                    <input {...getInputProps()} />
                    <i className="fa fa-lg fa-file-text text-purple " />
                    <div className="my-3">
                      Click to select or drag and drop a .csv file to insert into {schema}.{table}
                    </div>
                    <Button color="purple" className="px-5 browse-files">
                      browse files
                    </Button>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
          {status === 'inserting' ? (
            <Button block className="mt-2" color="black" onClick={handleCancel}>
              Return to Table View (Insert Runs in Background)
            </Button>
          ) : (
            <Row>
              <Col md="6" className="mt-2">
                <Button block disabled={['inserting', 'processing'].includes(status)} color="black" onClick={handleCancel}>
                  Cancel
                </Button>
              </Col>
              <Col md="6" className="mt-2">
                <Button block disabled={[false, 'inserting', 'processing'].includes(status)} color="success" onClick={insertData}>
                  Insert Records
                </Button>
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>
    </>
  );
};
