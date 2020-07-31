import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, CardBody, Card } from 'reactstrap';
import { useStoreState } from 'pullstate';

import instanceState from '../../../state/instanceState';

import EntityManager from './roleManager';
import StructureReloader from '../../shared/structureReloader';
import Loader from '../../shared/loader';

const JSONViewer = lazy(() => import(/* webpackChunkName: "roles-jsonviewer" */ './jsonviewer'));

const defaultState = {
  roleName: false,
  canEdit: false,
  superUsers: [],
  clusterUsers: [],
  standardUsers: [],
};

export default () => {
  const { compute_stack_id, role_id, customer_id } = useParams();
  const roles = useStoreState(instanceState, (s) => s.roles);
  const [formState, setFormState] = useState(defaultState);
  const baseUrl = `/o/${customer_id}/i/${compute_stack_id}/roles`;

  useEffect(() => {
    if (roles) {
      const thisRole = role_id && roles.find((r) => r.id === role_id);

      setFormState({
        ...formState,
        roleName: thisRole && thisRole.role,
        canEdit: thisRole && !thisRole.permission.cluster_user && !thisRole.permission.super_user,
        clusterUsers: roles.filter((r) => r.permission.cluster_user),
        superUsers: roles.filter((r) => r.permission.super_user),
        standardUsers: roles.filter((r) => !r.permission.super_user && !r.permission.cluster_user),
      });
    } else {
      setFormState(defaultState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role_id, roles]);

  return (
    <Row id="roles">
      <Col xl="3" lg="4" md="5" xs="12">
        <EntityManager showForm activeItem={role_id} items={formState.superUsers} baseUrl={baseUrl} itemType="super user" />
        <EntityManager showForm activeItem={role_id} items={formState.clusterUsers} baseUrl={baseUrl} itemType="cluster user" />
        <EntityManager showForm activeItem={role_id} items={formState.standardUsers} baseUrl={baseUrl} itemType="standard role" />
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        <Row className="floating-card-header">
          {formState.canEdit && <Col>edit role &gt; {formState.roleName}</Col>}
          <Col className="text-md-right">
            <StructureReloader label="refresh schemas, tables, and roles" />
          </Col>
        </Row>
        {formState.canEdit ? (
          <Card className="my-3">
            <CardBody className="full-height">
              <Suspense fallback={<Loader header=" " spinner />}>
                <JSONViewer />
              </Suspense>
            </CardBody>
          </Card>
        ) : (
          <Card className="my-3 py-5">
            <CardBody>
              {role_id ? (
                <div className="text-center">Super Users and Cluster Users have full access to all schemas, tables, and attributes.</div>
              ) : (
                <div className="text-center">Please choose or add a role to manage it.</div>
              )}
            </CardBody>
          </Card>
        )}
      </Col>
    </Row>
  );
};
