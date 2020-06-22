import React from 'react';
import { Card, CardBody, Row, Col, Alert, Button } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';

export default () => {
  const version = useStoreState(appState, (s) => s.version);

  return (
    <main id="support">
      <Row>
        <Col lg="4" className="mb-3">
          <span className="floating-card-header">Local Install Via NPM</span>
          <Card className="my-3">
            <CardBody className="installation">
              HarperDB requires NodeJS v12.x and NPM, available by{' '}
              <a target="_blank" rel="noopener noreferrer" href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm">
                clicking here
              </a>
              <hr />
              Once you&apos;ve installed NodeJS and NPM, execute the following command line operations to install HarperDB.
              <Alert className="mt-3" color="dark">
                npm i -g harperdb
                <br />
                <br />
                harperdb install
              </Alert>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" className="mb-3">
          <span className="floating-card-header">Offline Local Install</span>
          <Card className="my-3">
            <CardBody className="installation">
              If you need to install HarperDB on a device without access to NPM, you can fetch the installer using the link below.
              <Button disabled={!version.location} color="purple" block className="mt-3 mb-4" href={version?.location}>
                Download Install Package
              </Button>
              <hr />
              Once you move the downloaded file to the device, execute the following command line operations to install HarperDB.
              <Alert className="mt-3" color="dark">
                npm i -g harperdb-{version?.number || '...'}.tgz
                <br />
                <br />
                harperdb install
              </Alert>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" className="mb-3">
          <span className="floating-card-header">Docker Container</span>
          <Card className="my-3">
            <CardBody className="installation">
              Running HarperDB in a Docker container is as easy as fetching a stick.
              <Alert className="mt-3" color="dark">
                docker run -d -p harperdb/hdb
              </Alert>
              <hr />
              Add a volume to persist data
              <Alert className="mt-3" color="dark">
                -v &lt;host-data-path&gt;:/opt/harperdb/hdb
              </Alert>
              <hr />
              Add initial config arguments (default):
              <Alert className="mt-3" color="dark">
                --INIT_HDB_USERNAME (&quot;HDB_ADMIN&quot;)
                <br />
                --INIT_HDB_PASSWORD (&quot;password&quot;)
                <br />
                --INIT_CLUSTER_USERNAME (&quot;cluster_user&quot;)
                <br />
                --INIT_CLUSTER_PASSWORD(&quot;password&quot;)
                <br />
                --INIT_NODE_NAME (&quot;docker_node&quot;)
              </Alert>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </main>
  );
};
