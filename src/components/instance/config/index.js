import React, { useState } from 'react';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import instanceState from '../../../state/instanceState';
import appState from '../../../state/appState';

import UpdateDiskVolume from './updateDiskVolume';
import UpdateRAM from './updateRAM';
import RemoveInstance from './removeInstance';
import RestartInstance from './restartInstance';
import InstanceDetails from './instanceDetails';
import Loader from '../../shared/loader';

export default () => {
  const { customer_id } = useParams();
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const isOrgUser = useStoreState(appState, (s) => s.auth?.orgs?.find((o) => o.customer_id?.toString() === customer_id), [customer_id]);
  const isOrgOwner = isOrgUser?.status === 'owner';
  const [instanceAction, setInstanceAction] = useState(false);

  return instanceAction && instanceAction !== 'Restarting' ? (
    <Loader message={`${instanceAction} Instance`} />
  ) : (
    <Row id="config">
      <Col xs="12">
        <InstanceDetails />
      </Col>
      {isOrgOwner && (
        <Col lg="3" sm="6" xs="12">
          <span className="floating-card-header">update instance ram</span>
          <Card className="my-3">
            <CardBody>
              <UpdateRAM setInstanceAction={setInstanceAction} instanceAction={instanceAction} />
            </CardBody>
          </Card>
        </Col>
      )}
      {isOrgOwner && !is_local && (
        <Col lg="3" sm="6" xs="12">
          <span className="floating-card-header">update instance storage</span>
          <Card className="my-3">
            <CardBody>
              <UpdateDiskVolume setInstanceAction={setInstanceAction} instanceAction={instanceAction} />
            </CardBody>
          </Card>
        </Col>
      )}
      {isOrgOwner && (
        <Col lg="3" sm="6" xs="12">
          <span className="floating-card-header">remove instance</span>
          <Card className="my-3">
            <CardBody>
              <RemoveInstance setInstanceAction={setInstanceAction} instanceAction={instanceAction} />
            </CardBody>
          </Card>
        </Col>
      )}
      <Col lg="3" sm="6" xs="12">
        <span className="floating-card-header">restart instance</span>
        <Card className="my-3">
          <CardBody>
            <RestartInstance setInstanceAction={setInstanceAction} instanceAction={instanceAction} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
