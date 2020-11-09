import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, CardBody, Card, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';

import instanceState from '../../../functions/state/instanceState';

import EntityManager from './roleManager';
import Loader from '../../shared/loader';
import listRoles from '../../../functions/api/instance/listRoles';

const JSONViewer = lazy(() => import(/* webpackChunkName: "roles-jsonviewer" */ './jsonviewer'));

const defaultState = {
  roleName: false,
  canEdit: false,
  superUsers: [],
  clusterUsers: [],
  standardUsers: [],
  showAttributes: false,
};

const RolesIndex = () => {
  const { compute_stack_id, role_id, customer_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const roles = useStoreState(instanceState, (s) => s.roles);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState(defaultState);
  const baseUrl = `/o/${customer_id}/i/${compute_stack_id}/roles`;

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    await listRoles({ auth, url, is_local, compute_stack_id, customer_id });
    setLoading(false);
  }, [auth, url, is_local, compute_stack_id, customer_id]);

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
        showAttributes: false,
      });
    } else {
      setFormState(defaultState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role_id, roles]);

  useEffect(fetchRoles, [fetchRoles]);

  return (
    <Row id="roles">
      <Col xl="3" lg="4" md="5" xs="12">
        <EntityManager showForm activeItem={role_id} items={formState.superUsers} baseUrl={baseUrl} itemType="super user" />
        <EntityManager showForm activeItem={role_id} items={formState.clusterUsers} baseUrl={baseUrl} itemType="cluster user" />
        <EntityManager showForm activeItem={role_id} items={formState.standardUsers} baseUrl={baseUrl} itemType="standard role" />
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        <Row className="floating-card-header">
          {formState.canEdit && (
            <>
              <Col>edit role &gt; {formState.roleName}</Col>
            </>
          )}
          <Col className="text-md-right">
            {formState.canEdit && (
              <>
                <Button color="link" tabIndex="0" title="Show Attributes" onClick={() => setFormState({ ...formState, showAttributes: !formState.showAttributes })}>
                  <span className="mr-2">show all attributes</span>
                  <i className={`fa fa-lg fa-toggle-${formState.showAttributes ? 'on' : 'off'}`} />
                </Button>
                <span className="mx-3 text">|</span>
              </>
            )}
            <Button color="link" onClick={fetchRoles} className="mr-2">
              <span className="mr-2">refresh roles</span>
              <i title="Refresh Roles" className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} />
            </Button>
          </Col>
        </Row>
        {formState.canEdit ? (
          <Card className="my-3">
            <CardBody className="full-height">
              <Suspense fallback={<Loader header=" " spinner />}>
                <JSONViewer showAttributes={formState.showAttributes} />
              </Suspense>
            </CardBody>
          </Card>
        ) : (
          <Card className="my-3">
            <CardBody className="empty-prompt">
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

export default RolesIndex;
