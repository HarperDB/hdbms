import React from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';

import instanceState from '../../../state/stores/instanceState';
import ContentContainer from '../../shared/contentContainer';

export default () => {
  const thisInstance = useStoreState(instanceState);

  return (
    <>
      <span className="text-white mb-2 floating-card-header">instance overview</span>
      <Card className="my-3 instance-details">
        <CardBody>
          <Row>
            <Col xs="12">
              <ContentContainer header="Instance URL">
                <div className="instance-url">{thisInstance.url}</div>
              </ContentContainer>
            </Col>
            <Col md="2" sm="4" xs="6">
              <ContentContainer header="Name" className="mt-3">
                {thisInstance.instance_name}
              </ContentContainer>
            </Col>
            <Col md="2" sm="4" xs="6">
              <ContentContainer header="Created" className="mt-3">
                {new Date(thisInstance.creation_date).toLocaleDateString()}
              </ContentContainer>
            </Col>
            {thisInstance.instance_region && (
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Region" className="mt-3">
                  {thisInstance.instance_region}
                </ContentContainer>
              </Col>
            )}
            <Col md="2" sm="4" xs="6">
              <ContentContainer header="RAM" className="mt-3">
                {thisInstance.compute.ram}
              </ContentContainer>
            </Col>
            {!thisInstance.is_local && (
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Storage" className="mt-3">
                  {thisInstance.storage?.disk_space}
                </ContentContainer>
              </Col>
            )}
            <Col md="2" sm="4" xs="6">
              <ContentContainer header="Cluster" className="mt-3">
                {thisInstance.network.is_enabled ? 'On' : 'Off'}
              </ContentContainer>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <br />
    </>
  );
};
