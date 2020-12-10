import React from 'react';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';

const LinksIndex = () => (
  <main id="support">
    <Row>
      <Col lg="3" className="mb-3">
        <span className="floating-card-header">Instance API Docs</span>
        <Card className="my-3">
          <CardBody>
            <Button color="purple" block href="https://docs.harperdb.io" target="_blank" rel="noopener noreferrer">
              Visit docs.harperdb.io
            </Button>
          </CardBody>
        </Card>
      </Col>
      <Col lg="3" className="mb-3">
        <span className="floating-card-header">HarperDB Community Slack</span>
        <Card className="my-3">
          <CardBody>
            <Button
              color="purple"
              block
              href="https://join.slack.com/t/harperdbcommunity/shared_invite/zt-e8w6u1pu-2UFAXl_f4ZHo7F7DVkHIDA"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Our Slack Community
            </Button>
          </CardBody>
        </Card>
      </Col>
      <Col lg="3" className="mb-3">
        <span className="floating-card-header">SQL Features Matrix</span>
        <Card className="my-3">
          <CardBody>
            <Button color="purple" block href="https://harperdb.io/developers/documentation/sql-overview/sql-features-matrix/" target="_blank" rel="noopener noreferrer">
              HarperDB SQL Guides
            </Button>
          </CardBody>
        </Card>
      </Col>
      <Col lg="3" className="mb-3">
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

export default LinksIndex;
