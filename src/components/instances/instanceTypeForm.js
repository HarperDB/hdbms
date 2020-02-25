import React from 'react';
import { Row, Col, Card, CardBody, Button } from '@nio/ui-kit';

export default ({ setInstanceType }) => (
  <Row>
    <Col xs="12" lg="6" className="instance-form-card-holder">
      <Card>
        <CardBody className="instance-form-card-body">
          <div className="text-bold text-center">Add HarperDB Cloud Instance</div>
          <hr />
          <ul>
            <li>Free License Tier Available!</li>
            <li>Hosted on AWS</li>
            <li>Managed by HarperDB</li>
            <li>HarperDB License Included</li>
            <li>24/7 Customer Support</li>
            <li>Choose RAM and Disk Size</li>
            <li>Scale On Demand</li>
          </ul>
          <hr />
          <Button className="mt-3" color="purple" block onClick={() => setInstanceType('cloud')}>Add Cloud Instance</Button>
        </CardBody>
      </Card>
    </Col>
    <Col xs="12" lg="6" className="instance-form-card-holder">
      <Card>
        <CardBody className="instance-form-card-body">
          <div className="text-bold text-center">Register A Local Instance</div>
          <hr />
          <ul>
            <li>Free License Tier Available!</li>
            <li>For HarperDB Instances You Install</li>
            <li>Browse Instance Data</li>
            <li>Configure Users, Roles, and Clustering</li>
            <li>Manage Instance Licenses</li>
            <li>Handle Version Upgrades</li>
            <li>Instance Credentials Stay Local</li>
          </ul>
          <hr />
          <Button className="mt-3" color="purple" block onClick={() => setInstanceType('local')}>Register Local Instance</Button>
        </CardBody>
      </Card>
    </Col>
  </Row>
);
