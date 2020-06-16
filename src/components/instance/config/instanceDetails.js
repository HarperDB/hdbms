import React from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import { useParams } from 'react-router-dom';

import instanceState from '../../../state/instanceState';
import ContentContainer from '../../shared/contentContainer';

export default () => {
  const { compute_stack_id } = useParams();
  const url = useStoreState(instanceState, (s) => s.url);
  const totalPriceStringWithInterval = useStoreState(instanceState, (s) => s.totalPriceStringWithInterval);
  const compute = useStoreState(instanceState, (s) => s.compute);
  const instance_name = useStoreState(instanceState, (s) => s.instance_name);
  const creation_date = useStoreState(instanceState, (s) => s.creation_date);
  const instance_region = useStoreState(instanceState, (s) => s.instance_region);
  const storage = useStoreState(instanceState, (s) => s.storage);
  const is_local = useStoreState(instanceState, (s) => s.is_local);

  return (
    <>
      <span className="floating-card-header">instance overview</span>
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
