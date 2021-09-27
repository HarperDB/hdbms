import React, { useEffect } from 'react';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';

import appState from '../../../functions/state/appState';
import Code from '../../shared/Code';

const InstallationIndex = () => {
  const version = useStoreState(appState, (s) => s.version);

  useEffect(() => {
    if (window._kmq) window._kmq.push(['record', 'visited resources - installation']);
  }, []);

  return (
    <main id="support">
      <Row>
        <Col lg="4" className="mb-3">
          <span className="floating-card-header">Local Install Via NPM</span>
          <Card className="my-3">
            <CardBody className="installation">
              HarperDB requires <b>NodeJS v14.17.3</b> and NPM, available by{' '}
              <a target="_blank" rel="noopener noreferrer" href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm">
                clicking here
              </a>
              <hr />
              Once you&apos;ve installed NodeJS and NPM, execute the following command line operations to install HarperDB.
              <Code className="mt-3">
                {`npm i -g harperdb
harperdb install`}
              </Code>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" className="mb-3">
          <span className="floating-card-header">Offline Local Install</span>
          <Card className="my-3">
            <CardBody className="installation">
              If you need to install HarperDB on a device without access to NPM, you can fetch the installer using the link below.
              <Button
                id="downloadCurrentVersion"
                disabled={!version.number}
                color="purple"
                block
                className="mt-3 mb-4"
                href={`https://registry.npmjs.org/harperdb/-/harperdb-${version?.number}.tgz`}
              >
                Download Install Package
              </Button>
              <hr />
              Once you move the downloaded file to the device, execute the following command line operations to install HarperDB.
              <Code className="mt-3">
                {`npm i -g harperdb-${version?.number || '...'}.tgz
harperdb install`}
              </Code>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" className="mb-3">
          <span className="floating-card-header">Docker Container</span>
          <Card className="my-3">
            <CardBody className="installation">
              Run a HarperDB container in the background, with the HDB_ROOT directory mounted to the container host, and expose the HarperDB API port on the container host:
              <Code className="mt-3">{`docker run -d
  -v /host/directory:/opt/harperdb/hdb
  -e HDB_ADMIN_USERNAME=HDB_ADMIN
  -e HDB_ADMIN_PASSWORD=password
  -p 9925:9925
  harperdb/harperdb`}</Code>
              <Button color="purple" block className="mt-3 mb-4" href="https://hub.docker.com/r/harperdb/harperdb" target="_blank" rel="noreferrer">
                Visit Docker Hub to see more code examples
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </main>
  );
};

export default InstallationIndex;
