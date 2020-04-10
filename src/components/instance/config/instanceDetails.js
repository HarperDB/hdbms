import React from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';

import instanceState from '../../../state/instanceState';
import ContentContainer from '../../shared/contentContainer';

export default () => {
  const { url, totalPriceStringWithInterval, compute, instance_name, creation_date, instance_region, storage, is_local } = useStoreState(instanceState, (s) => ({
    url: s.url,
    totalPriceStringWithInterval: s.totalPriceStringWithInterval,
    compute: s.compute,
    instance_name: s.instance_name,
    creation_date: s.creation_date,
    instance_region: s.instance_region,
    storage: s.storage,
    is_local: s.is_local,
  }));

  return (
    <>
      <span className="text-white mb-2 floating-card-header">instance overview</span>
      <Card className="my-3 instance-details">
        <CardBody>
          <Row>
            <Col xs="12">
              <ContentContainer header="Instance URL">
                <div className="instance-url">{url}</div>
              </ContentContainer>
            </Col>
            <Col md="2" sm="4" xs="6">
              <ContentContainer header="Total Price" className="mt-3">
                {totalPriceStringWithInterval}
              </ContentContainer>
            </Col>
            <Col md="2" sm="4" xs="6">
              <ContentContainer header="RAM" className="mt-3">
                {compute?.label}
              </ContentContainer>
            </Col>
            {!is_local && (
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Storage" className="mt-3">
                  {storage?.label}
                </ContentContainer>
              </Col>
            )}
            <Col md="2" sm="4" xs="6">
              <ContentContainer header="Name" className="mt-3">
                {instance_name}
              </ContentContainer>
            </Col>
            <Col md="2" sm="4" xs="6">
              <ContentContainer header="Created" className="mt-3">
                {new Date(creation_date).toLocaleDateString()}
              </ContentContainer>
            </Col>
            {instance_region && (
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Region" className="mt-3">
                  {instance_region}
                </ContentContainer>
              </Col>
            )}
          </Row>
        </CardBody>
      </Card>
      <br />
    </>
  );
};
