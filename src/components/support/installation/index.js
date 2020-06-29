import React from 'react';
import { Card, CardBody, Row, Col, Button } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
              <SyntaxHighlighter className="mt-3" language="bash" style={atomDark}>
                {`npm i -g harperdb
harperdb install`}
              </SyntaxHighlighter>
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
              <SyntaxHighlighter className="mt-3" language="bash" style={atomDark}>
                {`npm i -g harperdb-${version?.number || '...'}.tgz
harperdb install`}
              </SyntaxHighlighter>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" className="mb-3">
          <span className="floating-card-header">Docker Container</span>
          <Card className="my-3">
            <CardBody className="installation">
              Running HarperDB in a Docker container is as easy as fetching a stick.
              <SyntaxHighlighter className="mt-3" language="bash" style={atomDark}>
                docker run -d -p harperdb/hdb
              </SyntaxHighlighter>
              <hr />
              Add a volume to persist data
              <SyntaxHighlighter className="mt-3" language="bash" style={atomDark}>
                -v &lt;host-data-path&gt;:/opt/harperdb/hdb
              </SyntaxHighlighter>
              <hr />
              Add initial config arguments (default):
              <SyntaxHighlighter className="mt-3" language="bash" style={atomDark}>
                {`--INIT_HDB_USERNAME ("HDB_ADMIN")
--INIT_HDB_PASSWORD ("password")
--INIT_CLUSTER_USERNAME ("cluster_user")
--INIT_CLUSTER_PASSWORD("password")
--INIT_NODE_NAME ("docker_node")`}
              </SyntaxHighlighter>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </main>
  );
};
