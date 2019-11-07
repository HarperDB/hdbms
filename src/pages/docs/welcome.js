import React from 'react';
import { Card, CardBody, Button, Row, Col } from '@nio/ui-kit';

export default () => (
  <Card className="mb-3 mt-2">
    <CardBody>
      <h4>Welcome</h4>
      <hr className="mt-2" />
      Welcome to HarperDB, the leading Enterprise Data Fabric Solution.<br /><br />

      We&apos;ve designed our product to be easy to install, easy to interact with, and easy to configure. Below are a few of the key features you&apos;ll probably want to know about. To get started, you can check out the other tabs above!<br /><br />

      Sample code is also available in many common languages in the sample code pane.  Select the language you want from the drop down and paste the code into your application.

      <hr />

      <div className="px-3">
        <Row>
          <Col md="6" className="mb-2">
            <Card className="mb-3 mt-2">
              <CardBody>
                <h6>Patented Storage Algorithm</h6>
                <hr className="mt-2" />
                All content in HarperDB is indexed by default. Even with a billion records, our patented approach leverages the file system to ensure that when you want to access a complex query on a large dataset, you don&apos;t have to worry about whether your DBA has optimized your data- we&apos;ve already taken care of that for you.
              </CardBody>
            </Card>
          </Col>
          <Col md="6" className="mb-2">
            <Card className="mb-3 mt-2">
              <CardBody>
                <h6>Dynamic Schema</h6>
                <hr className="mt-2" />
            No need to define your columns&apos; data types- including JSON! It&apos;s the best of both worlds. Structured or unstructured data, with all the performance you&apos;ve come to expect from highly specialized data storage solutions, but with the convenience that we know makes the difference.
              </CardBody>
            </Card>
          </Col>
          <Col md="6" className="mb-2">
            <Card className="mb-3 mt-2">
              <CardBody>
                <h6>Built In API</h6>
                <hr className="mt-2" />
            HarperDB comes with a built-in API that makes it easy to get data in and out. You can build an entire application with no middleware at all, reducing the time it takes to get back to the important stuff, like your dog. We also have more traditional JDBC and ODBC drivers, as well as modules for data flow platforms like Node-Red and nio.
              </CardBody>
            </Card>
          </Col>
          <Col md="6" className="mb-2">
            <Card className="mb-3 mt-2">
              <CardBody>
                <h6>SQL and NoSQL Operations</h6>
                <hr className="mt-2" />
            Since getting data in is so easy, we worked hard to ensure that it&apos;s just as easy to get data out. Which means that you can query your data through our API using our JSON Object Logic, or you can straight-up use traditional SQL. Want to join two unstructured tables without two queries and joining them in application code? we are the answer.
              </CardBody>
            </Card>
          </Col>
          <Col md="6" className="mb-2">
            <Card className="mb-3 mt-2">
              <CardBody>
                <h6>Runs from Edge to Cloud</h6>
                <hr className="mt-2" />
            HarperDB has a tiny footprint (under 100MB!), and uses almost no system resources unless it&apos;s accessing the hard drive. We deploy the same version on Raspberry Pis at the edge that we do on 32 core cloud servers- which means that your DevOps task list just got simpler. SImple is good. We like simple.
              </CardBody>
            </Card>
          </Col>
          <Col md="6" className="mb-2">
            <Card className="mb-3 mt-2">
              <CardBody>
                <h6>Advanced Pub-Sub Data Replication</h6>
                <hr className="mt-2" />
            Bi-directional, table-level replication puts you in control of where data lives, where it&apos;s going, and how long it stays. Use HarperDB to move data from edge sensors to your ERP system. Or to drive your HMI by capturing high-spedd data from a PLC. Or for something way cooler, like a database of all your office dogs.
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      <hr />

      <div className="text-center">Now that we&apos;ve sold you, get on in there!</div>


    </CardBody>
  </Card>
);
