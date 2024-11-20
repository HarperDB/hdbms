import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, CardBody, Card, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';
import instanceState from '../../../functions/state/instanceState';
import EntityManager from './RoleManager';
import Loader from '../../shared/Loader';
import listRoles from '../../../functions/api/instance/listRoles';
import registrationInfo from '../../../functions/api/instance/registrationInfo';
const JSONViewer = lazy(() => import(/* webpackChunkName: "roles-jsonviewer" */'./JsonViewer'));
const defaultState = {
  roleName: false,
  canEdit: false,
  superUsers: [],
  clusterUsers: [],
  standardUsers: [],
  showAttributes: false
};
function RolesIndex() {
  const {
    roleId,
    customerId
  } = useParams();
  const computeStackId = useStoreState(instanceState, s => s.computeStackId);
  const auth = useStoreState(instanceState, s => s.auth);
  const url = useStoreState(instanceState, s => s.url);
  const roles = useStoreState(instanceState, s => s.roles, [computeStackId]);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState(defaultState);
  const baseUrl = `/o/${customerId}/i/${computeStackId}/roles`;
  const version = useStoreState(instanceState, s => s.registration?.version);
  const [major, minor] = version?.split('.') || [];
  const versionAsFloat = parseFloat(`${major}.${minor}`);
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    await listRoles({
      auth,
      url
    });
    await registrationInfo({
      auth,
      url
    });
    setLoading(false);
  }, [auth, url]);
  useEffect(() => {
    if (roles) {
      const thisRole = roleId && roles.find(r => r.id === roleId);
      setFormState({
        ...formState,
        roleName: thisRole && thisRole.role,
        canEdit: thisRole && !thisRole.permission.clusterUser && !thisRole.permission.superUser,
        clusterUsers: roles.filter(r => r.permission.clusterUser),
        superUsers: roles.filter(r => r.permission.superUser),
        standardUsers: roles.filter(r => !r.permission.superUser && !r.permission.clusterUser),
        showAttributes: false
      });
    } else {
      setFormState(defaultState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId, roles]);
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles, computeStackId]);
  return <Row id="roles">
      <Col xl="3" lg="4" md="5" xs="12">
        <EntityManager showForm activeItem={roleId} items={formState.superUsers} baseUrl={baseUrl} itemType="super user" />
        <EntityManager showForm activeItem={roleId} items={formState.clusterUsers} baseUrl={baseUrl} itemType="cluster user" />
        <EntityManager showForm activeItem={roleId} items={formState.standardUsers} baseUrl={baseUrl} itemType="standard role" />
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        <Row className="floating-card-header">
          {formState.canEdit && <Col>edit role &gt; {formState.roleName}</Col>}
          <Col className="text-md-end">
            {formState.canEdit && <>
                <Button color="link" tabIndex="0" title="Show Attributes" onClick={() => setFormState({
              ...formState,
              showAttributes: !formState.showAttributes
            })}>
                  <span className="me-2">show all attributes</span>
                  <i className={`fa fa-lg fa-toggle-${formState.showAttributes ? 'on' : 'off'}`} />
                </Button>
                <span className="mx-3 text">|</span>
              </>}
            <Button color="link" onClick={fetchRoles} className="me-2">
              <span className="me-2">refresh roles</span>
              <i title="Refresh Roles" className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'}`} />
            </Button>
          </Col>
        </Row>
        {formState.canEdit ? <Card className="my-3">
            <CardBody className="full-height">
              <Suspense fallback={<Loader header=" " spinner />}>
                <JSONViewer showAttributes={formState.showAttributes} fetchRoles={fetchRoles} />
              </Suspense>
            </CardBody>
          </Card> : <Card className="my-3">
            <CardBody>
              {roleId ? <div className="empty-prompt">Super Users and Cluster Users have full access to all {versionAsFloat >= 4.2 ? 'databases' : 'schemas'}, tables, and attributes.</div> : <div className="empty-prompt">Please choose or add a role to manage it.</div>}
            </CardBody>
          </Card>}
      </Col>
    </Row>;
}
export default RolesIndex;