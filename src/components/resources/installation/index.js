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
              Running HarperDB in a Docker container is as easy as fetching a stick.
              <Code className="mt-3">docker run -d -p harperdb/hdb</Code>
              <hr />
              Add a volume to persist data
              <Code className="mt-3">-v &lt;host-data-path&gt;:/opt/harperdb/hdb</Code>
              <hr />
              Add initial config arguments (default):
              <br />
              <a href="https://harperdb.io/docs/reference/configuration-file/" target="_blank" rel="noreferrer">
                Click here to see all possible ENV vars
              </a>
              <Code className="mt-3">
                {`--HDB_USERNAME ("HDB_ADMIN")
--HDB_PASSWORD ("password")
--CLUSTERING ("true")
--CLUSTERING_USER ("cluster_user")
--CLUSTERING_PASSWORD("password")
--NODE_NAME ("docker_node")`}
              </Code>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </main>
  );
};

export default InstallationIndex;
