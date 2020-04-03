import React, { useState } from 'react';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import instanceState from '../../../state/stores/instanceState';

import UpdateDiskVolume from './updateDiskVolume';
import UpdateRAM from './updateRAM';
import RemoveInstance from './removeInstance';
import RestartInstance from './restartInstance';
import InstanceDetails from './instanceDetails';
import InstanceLogs from './instanceLogs';
import Loader from '../../shared/loader';
import ContentContainer from '../../shared/contentContainer';
import appState from '../../../state/stores/appState';
import customerHasChargeableCard from '../../../util/stripe/customerHasChargeableCard';

export default () => {
  const { cloudInstancesBeingModified, hasCard } = useStoreState(appState, (s) => ({
    cloudInstancesBeingModified: s.instances.filter((i) => !i.is_local && !['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(i.status)).length,
    hasCard: customerHasChargeableCard(s.customer),
  }));
  const { is_local, storage, compute } = useStoreState(instanceState, (s) => ({
    is_local: s.is_local,
    storage: s.storage,
    compute: s.compute,
  }));

  const [instanceAction, setInstanceAction] = useState(false);

  let totalPrice = 0;

  if (compute) totalPrice += compute.price === 'FREE' ? 0 : parseFloat(compute.price);
  if (storage) totalPrice += storage.price === 'FREE' ? 0 : parseFloat(storage.price);

  return instanceAction && instanceAction !== 'Restarting' ? (
    <Loader message={`${instanceAction} Instance`} />
  ) : (
    <Row id="config">
      <Col xs="12">
        <InstanceDetails totalPrice={totalPrice ? `$${totalPrice.toFixed(2)}/${compute.interval}` : 'FREE'} />
      </Col>
      <Col lg="4" xs="12">
        <span className="text-white mb-2 floating-card-header">instance actions</span>
        <Card className="my-3">
          <CardBody>
            <ContentContainer header="Update Instance RAM" className="mb-3">
              <UpdateRAM
                setInstanceAction={setInstanceAction}
                instanceAction={instanceAction}
                storagePrice={!storage || storage.price === 'FREE' ? 0 : parseFloat(storage.price)}
              />
            </ContentContainer>
            {!is_local && (
              <ContentContainer header="Update Instance Storage" className="mb-3">
                <UpdateDiskVolume
                  setInstanceAction={setInstanceAction}
                  instanceAction={instanceAction}
                  computePrice={!compute || compute.price === 'FREE' ? 0 : parseFloat(compute.price)}
                />
              </ContentContainer>
            )}
            <ContentContainer header="Remove Instance" className="mb-3">
              <RemoveInstance setInstanceAction={setInstanceAction} instanceAction={instanceAction} />
            </ContentContainer>
            <ContentContainer header="Restart Instance" className="mb-2">
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
