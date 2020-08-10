import React from 'react';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';

export default () => (
  <main id="support">
    <Row>
      <Col lg="4" className="mb-3">
        <span className="floating-card-header">Instance API Docs</span>
        <Card className="my-3">
          <CardBody>
            <Button color="purple" block href="https://docs.harperdb.io" target="_blank" rel="noopener noreferrer">
              Visit docs.harperdb.io
            </Button>
          </CardBody>
        </Card>
      </Col>
      <Col lg="4" className="mb-3">
        <span className="floating-card-header">SQL Features Matrix</span>
        <Card className="my-3">
          <CardBody>
            <Button color="purple" block href="https://harperdbhelp.zendesk.com/hc/en-us/articles/115001803433-SQL-Features-Matrix" target="_blank" rel="noopener noreferrer">
              HarperDB SQL Guides
            </Button>
          </CardBody>
        </Card>
      </Col>
      <Col lg="4" className="mb-3">
        <span className="floating-card-header">Create A Support Ticket</span>
        <Card className="my-3">
          <CardBody>
            <Button color="purple" block href="https://harperdbhelp.zendesk.com/hc/en-us/requests/new" target="_blank" rel="noopener noreferrer">
              HarperDB Zendesk Portal
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </main>
);
