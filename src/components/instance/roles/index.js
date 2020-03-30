import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, CardBody, Card } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import instanceState from '../../../state/stores/instanceState';

import EntityManager from './roleManager';
import JSONViewer from './jsonviewer';

const defaultState = { roleName: false, canEdit: false, editJSON: true, superUsers: [], clusterUsers: [], standardUsers: [] };

export default () => {
  const { compute_stack_id, role_id } = useParams();
  const roles = useStoreState(instanceState, (s) => s.roles);
  const [formState, setFormState] = useState(defaultState);
  const baseUrl = `/instance/${compute_stack_id}/roles`;

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
  }, [role_id, roles]);

  return (
    <Row id="roles">
      <Col xl="3" lg="4" md="5" xs="12">
        <EntityManager
          showForm
          activeItem={role_id}
          items={formState.superUsers}
          baseUrl={baseUrl}
          itemType="super user"
        />
        <EntityManager
          showForm
          activeItem={role_id}
          items={formState.clusterUsers}
          baseUrl={baseUrl}
          itemType="cluster user"
        />
        <EntityManager
          showForm
          activeItem={role_id}
          items={formState.standardUsers}
          baseUrl={baseUrl}
          itemType="standard role"
        />
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        {formState.canEdit ? (
          <>
            <Row>
              <Col className="text-nowrap">
                <span className="text-white mb-2 floating-card-header">edit role &gt; {formState.roleName}&nbsp;</span>
              </Col>
              {/*
              <Col className="text-right text-white text-nowrap">
                <a onClick={() => setFormState({ ...formState, editJSON: true })}>
                  <span className="floating-card-header">json</span>
                  <i title="Edit JSON" className="fa fa-code ml-1 floating-card-header" />
                </a>
                <span className="mx-2 text">|</span>
                <a onClick={() => setFormState({ ...formState, editJSON: false })}>
                  <span className="floating-card-header">table</span>
                  <i title="Edit JSON" className="fa fa-check-square-o ml-1 floating-card-header" />
                </a>
              </Col>
              */}
            </Row>
            <Card className="my-3">
              <CardBody className="full-height">
                {formState.editJSON ? (
                  <JSONViewer />
                ) : (
                  <div className="text-center py-5">table editor coming soon!</div>
                )}
              </CardBody>
            </Card>
          </>
        ) : (
          <>
            <span className="text-white mb-2 floating-card-header">&nbsp;</span>
            <Card className="my-3 py-5">
              <CardBody>
                {role_id ? (
                  <div className="text-center">Super Users and Cluster Users have full access to all schemas, tables, and attributes.</div>
                ) : (
                  <div className="text-center">Please choose or add a role to manage it.</div>
                )}
              </CardBody>
            </Card>
          </>
        )}
      </Col>
    </Row>
  );
};
