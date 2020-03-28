import React from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';

import instanceState from '../../../state/stores/instanceState';

export default () => {
  const thisInstance = useStoreState(instanceState);

  return (
    <>
      <span className="text-white mb-2 floating-card-header">instance overview</span>
      <Card className="my-3 instance-details">
        <CardBody>
          <Row>
            <Col xs="12" className="mb-3">
              <div className="fieldset-label">Instance URL</div>
              <hr className="my-1" />
              <div className="instance-url">{thisInstance.url}</div>
            </Col>
            <Col md="2" sm="4" xs="6" className="mb-3">
              <div className="fieldset-label">Name</div>
              <div className="fieldset">
                {thisInstance.instance_name}
              </div>
            </Col>
            <Col md="2" sm="4" xs="6" className="mb-3">
              <div className="fieldset-label">Created</div>
              <div className="fieldset">
                {new Date(thisInstance.creation_date).toLocaleDateString()}
              </div>
            </Col>
            {thisInstance.instance_region && (
              <Col md="2" sm="4" xs="6" className="mb-3">
                <div className="fieldset-label">Region</div>
                <div className="fieldset">
                  {thisInstance.instance_region}
                </div>
              </Col>
            )}
            <Col md="2" sm="4" xs="6" className="mb-3">
              <div className="fieldset-label">RAM</div>
              <div className="fieldset">
                {thisInstance.compute.ram}
              </div>
            </Col>
            {!thisInstance.is_local && (
              <Col md="2" sm="4" xs="6" className="mb-3">
                <div className="fieldset-label">Storage</div>
                <div className="fieldset">
                  {thisInstance.storage?.disk_space}
                </div>
              </Col>
            )}
            <Col md="2" sm="4" xs="6" className="mb-3">
              <div className="fieldset-label">Cluster</div>
              <div className="fieldset">
                {thisInstance.network.is_enabled ? 'On' : 'Off'}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <br />
    </>
  );
};
