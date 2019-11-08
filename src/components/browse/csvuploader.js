import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useHistory, useParams } from 'react-router';
import CSVReader from 'react-csv-reader';
import useAsyncEffect from 'use-async-effect';

import { HarperDBContext } from '../../providers/harperdb';
import Worker from 'worker-loader!../../util/processCSV.worker';

export default ({ update }) => {
  const { queryHarperDB } = useContext(HarperDBContext);
  const history = useHistory();
  const { schema, table, hash, action } = useParams();
  const [rawData, setRawData] = useState(false);
  const [processedData, setProcessedData] = useState(false);
  const [insertingData, setInsertingData] = useState(false);
  const [fileError, setFileError] = useState(false);

  useEffect(() => {
    if (rawData) {
      const worker = new Worker();
      worker.postMessage(rawData);
      worker.addEventListener('message', (event) => {
        setRawData(false);
        setProcessedData(event.data);
      });
    }
  }, [rawData]);

  useAsyncEffect(async () => {
    if (insertingData) {
      await queryHarperDB({
        operation: 'csv_data_load', action: 'insert', schema, table, data: processedData,
      });
      setProcessedData(false);

      setTimeout(() => {
        update();
        history.push(`/browse/${schema}/${table}`);
      }, 1000);
    }
  }, [insertingData]);

  const handleClear = () => {
    setProcessedData(false);
    setRawData(false);
  };

  const handleCancel = () => {
    setProcessedData(false);
    setRawData(false);
    history.push(`/browse/${schema}/${table}`);
  };

  return (
    <>
      <span className="text-bold text-white mb-2">{schema} {table && '>'} {table} {action === 'add' ? '> add new' : hash ? `> ${hash}` : ''}&nbsp;</span>
      <Card className="mb-3 mt-2">
        <CardBody>
          <div id="csv-uploader">
            <div id="csv-message">
              {insertingData ? (
                <div className="text-purple text-center">Inserting {processedData.length} records into {table}</div>
              ) : fileError ? (
                <div className="text-danger text-center">{fileError}</div>
              ) : processedData && processedData.length ? (
                <div className="text-purple text-center">Received .csv with {processedData.length} records. Click the insert button below to proceed</div>
              ) : processedData ? (
                <div className="text-danger text-center">That file had zero records</div>
              ) : (
                <div className="text-center">Click to select or drag and drop a .csv file to insert into {table}</div>
              )}
            </div>
            <CSVReader
              onFileLoaded={setRawData}
              onError={setFileError}
              inputId="csv-input"
            />
          </div>
          <hr />
          <Row>
            <Col lg="4" md="12" className="mb-2">
              <Button block color="black" onClick={handleCancel}>Cancel</Button>
            </Col>
            <Col lg="4" md="12" className="mb-2">
              {processedData ? (
                <Button block color="danger" onClick={handleClear}>Clear Data</Button>
              ) : (
                <Button block disabled color="danger">Clear Data</Button>
              )}
            </Col>
            <Col lg="4" md="12" className="mb-2">
              {processedData ? (
                <Button block color="success" onClick={() => setInsertingData(true)}>Insert {processedData.length} Records</Button>
              ) : (
                <Button block disabled color="success">Insert Records</Button>
              )}
            </Col>
          </Row>

        </CardBody>
      </Card>
    </>
  );
};
