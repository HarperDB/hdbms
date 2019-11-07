import React from 'react';
import { Button, Card, CardBody, Col, Row, Code } from '@nio/ui-kit';

export default () => (
  <Card className="mb-3 mt-2">
    <CardBody>
      <h4>Installation</h4>
      <hr className="mt-2" />

      We focused a lot on making HarperDB just as easy to install as it is to use. The most popular methods are outlined below.

      <hr />

      <div className="px-3">
        <Row>
          <Col lg="4" className="mb-2">
            <Card className="mb-3 mt-2 h-100">
              <CardBody>
                <h6>NPM Install</h6>
                <hr className="mt-2" />

                HarperDB is built on top of <a href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm">NodeJS/NPM</a>. Once they&apos;re installed, run the commands below to get up and running:<br /><br />

                <div className="multiline">
                  <Code>&gt; npm install -g harperdb</Code>
                  <Code>&gt; harperdb install</Code>
                </div>

              </CardBody>
            </Card>
          </Col>
          <Col lg="4" className="mb-2">
            <Card className="mb-3 mt-2 h-100">
              <CardBody>
                <h6>Docker Container</h6>
                <hr className="mt-2" />

                We love Docker, so we created a container that you can have up and running in seconds:<br /><br />

                <div className="multiline">
                  <Code>&gt; docker run</Code>
                  <Code>-v &lt;your-host-data-path&gt;:/opt/harperdb/hdb/</Code>
                  <Code>--INIT_HDB_USERNAME HDB_ADMIN</Code>
                  <Code>--INIT_HDB_PASSWORD &lt;your-password&gt;</Code>
                  <Code>--INIT_CLUSTER_USERNAME CLUSTER_USER</Code>
                  <Code>--INIT_CLUSTER_PASSWORD &lt;your-password&gt;</Code>
                  <Code>--INIT_NODE_NAME &lt;your-node-name&gt;</Code>
                  <Code>harperdb:latest</Code>
                </div>

              </CardBody>
            </Card>
          </Col>
          <Col lg="4" className="mb-2">
            <Card className="mb-3 mt-2 h-100">
              <CardBody>
                <h6>More Info, Other Versions, etc.</h6>
                <hr className="mt-2" />

                Visit our product page to learn about offline installs, legacy version, and other stuff.<br />
                <div className="mt-4 text-center">
                  <Button color="purple" href="https://products.harperdb.io/download" target="_blank" rel="noopener noreferrer">Visit Our Product Download Page</Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

    </CardBody>
  </Card>
);
