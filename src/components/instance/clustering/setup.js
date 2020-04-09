import React, { useState } from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';

import config from '../../../../config';
import instanceState from '../../../state/stores/instanceState';

import Role from './setupRole';
import User from './setupUser';
import Port from './setupPort';
import Enable from './setupEnable';
import NodeName from './setupNodeName';
import Instructions from './setupInstructions';
import Loader from '../../shared/loader';

import configureCluster from '../../../api/instance/configureCluster';
import restartInstance from '../../../api/instance/restartInstance';

export default () => {
  const { compute_stack_id } = useParams();
  const { cluster_role, cluster_user, name, auth, url } = useStoreState(
    instanceState,
    (s) => ({
      cluster_role: s.network.cluster_role,
      cluster_user: s.network.cluster_user,
      name: s.network.name,
      auth: s.auth,
      url: s.url,
    }),
    [compute_stack_id]
  );
  const [nodeNameMatch, setNodeNameMatch] = useState(compute_stack_id === name);
  const [formState, setFormState] = useState({});

  useAsyncEffect(async () => {
    if (formState.submitted) {
      await configureCluster({
        compute_stack_id,
        cluster_user,
        port: 12345,
        auth,
        url,
      });
      await restartInstance({ auth, url });
      setFormState({ restarting: true });
    }
  }, [formState.submitted]);

  useInterval(() => {
    if (formState.restarting) {
      instanceState.update((s) => {
        s.lastUpdate = Date.now();
      });
    }
  }, config.instance_refresh_rate);

  return (
    <Row id="clustering">
      <Col xl="3" lg="4" md="5" xs="12">
        <span className="text-white mb-2 floating-card-header">enable clustering</span>
        <Card className="my-3">
          <CardBody>
            <Role />
            {cluster_role && <User />}
            {cluster_user && <Port port={12345} />}
            {cluster_role && cluster_user && <NodeName nodeNameMatch={nodeNameMatch} setNodeNameMatch={setNodeNameMatch} />}
            {cluster_role && cluster_user && nodeNameMatch && <Enable setFormState={setFormState} disabled={formState.submitted} />}
          </CardBody>
        </Card>
      </Col>
      <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
        <span className="text-white mb-2 floating-card-header">&nbsp;</span>
        {formState.restarting ? <Loader message="configuring clustering" /> : <Instructions showNodeNameInstructions={compute_stack_id !== name} />}
      </Col>
    </Row>
  );
};
