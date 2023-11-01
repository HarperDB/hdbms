import React from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';
import AWSLogo from '../../shared/logos/AWSLogo';
import appState from '../../../functions/state/appState';

function TypeAWS({ setFormData }) {
  const theme = useStoreState(appState, (s) => s.theme);
  return (
    <Card className="mb-3">
      <CardBody className="instance-form-card-body">
        <Row>
          <Col xs="8" className="logo-header">
            <AWSLogo theme={theme} />
          </Col>
          <Col xs="4">
            <Button
              id="createCloudInstanceButton"
              color="purple"
              block
              onClick={() => setFormData({ cloud_provider: 'aws', is_local: false, is_wavelength: false, is_akamai: false })}
            >
              Create
            </Button>
          </Col>
        </Row>

        <hr />
        <ul className="mb-0">
          <li>On AWS EC2</li>
          <li>Billed Monthly, Free Tier Available</li>
          <li>24/7 Customer Support</li>
          <li>Choose RAM and Disk Size</li>
        </ul>
      </CardBody>
    </Card>
  );
}

export default TypeAWS;
