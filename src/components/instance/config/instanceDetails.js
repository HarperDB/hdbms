import React from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';

import instanceState from '../../../state/instanceState';
import ContentContainer from '../../shared/contentContainer';

export default () => {
  const { url, totalPriceStringWithInterval, compute, instance_name, creation_date, instance_region, storage, is_local, compute_stack_id } = useStoreState(instanceState, (s) => ({
    url: s.url,
    totalPriceStringWithInterval: s.totalPriceStringWithInterval,
    compute: s.compute,
    instance_name: s.instance_name,
    creation_date: s.creation_date,
    instance_region: s.instance_region,
    storage: s.storage,
    is_local: s.is_local,
    compute_stack_id: s.compute_stack_id,
  }));

  return (
    <>
      <span className="text-white mb-2 floating-card-header">instance overview</span>
      <Card className="my-3 instance-details">
        <CardBody>
          <Row>
            <Col md="6" xs="12">
              <ContentContainer header="Instance URL" className="mb-3">
                <div className="nowrap-scroll">{url}</div>
              </ContentContainer>
            </Col>
            <Col md="6" xs="12">
              <ContentContainer header="Instance Node Name (for clustering)" className="mb-3">
                <div className="nowrap-scroll">{compute_stack_id}</div>
              </ContentContainer>
            </Col>
            <Col md="2" sm="4" xs="6">
              <ContentContainer header="Total Price" className="mb-3">
                <div className="nowrap-scroll">{totalPriceStringWithInterval}</div>
              </ContentContainer>
            </Col>
            <Col md="2" sm="4" xs="6">
              <ContentContainer header="RAM" className="mb-3">
                <div className="nowrap-scroll">{compute?.label}</div>
              </ContentContainer>
            </Col>
            {!is_local && (
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Storage" className="mb-3 text-nowrap">
                  <div className="nowrap-scroll">{storage?.label}</div>
                </ContentContainer>
              </Col>
            )}
            <Col md="2" sm="4" xs="6">
              <ContentContainer header="Name" className="mb-3">
                <div className="nowrap-scroll">{instance_name}</div>
              </ContentContainer>
            </Col>
            <Col md="2" sm="4" xs="6">
              <ContentContainer header="Created" className="mb-3">
                <div className="nowrap-scroll">{new Date(creation_date).toLocaleDateString()}</div>
              </ContentContainer>
            </Col>
            {instance_region && (
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Region" className="mb-3">
                  <div className="nowrap-scroll">{instance_region}</div>
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
