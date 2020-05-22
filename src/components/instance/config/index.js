import React, { useState } from 'react';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import instanceState from '../../../state/instanceState';
import appState from '../../../state/appState';

import UpdateDiskVolume from './updateDiskVolume';
import UpdateRAM from './updateRAM';
import RemoveInstance from './removeInstance';
import RestartInstance from './restartInstance';
import InstanceDetails from './instanceDetails';
import InstanceLogs from './instanceLogs';
import Loader from '../../shared/loader';
import ContentContainer from '../../shared/contentContainer';

export default () => {
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const auth = useStoreState(appState, (s) => s.auth);
  const customer_id = useStoreState(appState, (s) => s.customer?.customer_id);
  const isOrgOwner = auth?.orgs?.find((o) => o.customer_id === customer_id)?.status === 'owner';
  const [instanceAction, setInstanceAction] = useState(false);

  return instanceAction && instanceAction !== 'Restarting' ? (
    <Loader message={`${instanceAction} Instance`} />
  ) : (
    <Row id="config">
      <Col xs="12">
        <InstanceDetails />
      </Col>
      <Col lg="4" xs="12">
        <span className="floating-card-header">instance actions</span>
        <Card className="my-3">
          <CardBody>
            {isOrgOwner && (
              <>
                <ContentContainer header="Update Instance RAM" className="mb-3">
                  <UpdateRAM setInstanceAction={setInstanceAction} instanceAction={instanceAction} />
                </ContentContainer>
                {!is_local && (
                  <ContentContainer header="Update Instance Storage" className="mb-3">
                    <UpdateDiskVolume setInstanceAction={setInstanceAction} instanceAction={instanceAction} />
                  </ContentContainer>
                )}
                <ContentContainer header="Remove Instance" className="mb-3">
                  <RemoveInstance setInstanceAction={setInstanceAction} instanceAction={instanceAction} />
                </ContentContainer>
              </>
            )}
            <ContentContainer header="Restart Instance">
              <RestartInstance setInstanceAction={setInstanceAction} instanceAction={instanceAction} />
            </ContentContainer>
          </CardBody>
        </Card>
      </Col>
      <Col lg="8" xs="12">
        <InstanceLogs />
      </Col>
    </Row>
  );
};
