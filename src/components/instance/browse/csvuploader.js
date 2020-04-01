import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useHistory, useParams } from 'react-router';
import CSVReader from 'react-csv-reader';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';

import getTotalRecords from '../../../api/instance/getTotalRecords';
import csvDataLoad from '../../../api/instance/csvDataLoad';
import commaNumbers from '../../../util/commaNumbers';
import Worker from '../../../util/processCSV.worker';
import instanceState from '../../../state/stores/instanceState';

const worker = new Worker();

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
  const [validatedRecordCount, setValidatedRecordCount] = useState(0);
  const [initialRecordCount, setInitialRecordCount] = useState(0);
  const [fileError, setFileError] = useState(false);

  // query the table to determine if all the records have been processed.
  const validateData = async () => {
    setStatus('validating');
    const validatedCount = await getTotalRecords({ schema, table, auth, url });
    setValidatedRecordCount(validatedCount);
    if (validatedCount !== initialRecordCount && validatedCount < newRecordCount + initialRecordCount) {
      return setTimeout(() => validateData(), 1000);
    }
    instanceState.update((s) => {
      s.lastUpdate = Date.now();
    });
    return setTimeout(() => {
      setStatus(false);
      history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}`);
    }, 1000);
  };

  // insert the processed data into HarperDB
  const insertData = async () => {
    if (!processedData) return false;
    setStatus('inserting');
    await csvDataLoad({
      schema,
      table,
      data: processedData,
      auth,
      url,
    });
    setProcessedData(false);
    return setTimeout(() => validateData(), 1000);
  };

  // after they've selected/dropped the file, send it to the worker
  const processData = (data) => {
    setStatus('processing');
    setNewRecordCount(data.length - 1);
    worker.postMessage(data);
    worker.addEventListener('message', (event) => {
      setProcessedData(event.data);
      setStatus('processed');
    });
  };

  const handleClear = () => {
    setProcessedData(false);
    setStatus(false);
  };

  const handleCancel = () => {
    setProcessedData(false);
    setStatus(false);
    history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}`);
  };

  useAsyncEffect(
    async () =>
      setInitialRecordCount(
        await getTotalRecords({
          schema,
          table,
          auth,
          url,
        })
      ),
    []
  );

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
                {status === 'validating' ? (
                  <div className="text-purple text-center">
                    validated {validatedRecordCount ? commaNumbers(validatedRecordCount - initialRecordCount) : '0'} of {commaNumbers(newRecordCount)} records
                  </div>
                ) : status === 'inserting' ? (
                  <div className="text-purple text-center">
                    inserting {commaNumbers(newRecordCount)} records into {schema}.{table}
                  </div>
                ) : status === 'processed' ? (
                  <div className="text-purple text-center">
                    successfully prepared {commaNumbers(newRecordCount)} records
                    <br />
                    <Button color="purple" className="mt-3 px-5 clear-files" onClick={handleClear}>
                      replace file
                    </Button>
                  </div>
                ) : status === 'processing' ? (
                  <div className="text-purple text-center">pre-processing {commaNumbers(newRecordCount)} records</div>
                ) : fileError ? (
                  <div className="text-danger text-center">{fileError}</div>
                ) : (
                  <div className="text-center">
                    Click to select or drag and drop a .csv file to insert into {schema}.{table}
                    <br />
                    <Button color="purple" className="mt-3 px-5 browse-files">
                      browse files
                    </Button>
                  </div>
                )}
              </div>
              {!status && (
                <CSVReader
                  onFileLoaded={processData}
                  onError={setFileError}
                  parserOptions={{
                    skipEmptyLines: true,
                  }}
                  inputId="csv-input"
                />
              )}
            </CardBody>
          </Card>
          {status === 'validating' ? (
            <Button block className="mt-2" color="black" onClick={handleCancel}>
              Return to Table View (Validate in Background)
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
