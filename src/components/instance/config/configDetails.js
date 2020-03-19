import React from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';

import instanceState from '../../../state/stores/instanceState';

export default () => {
  const thisInstance = useStoreState(instanceState);

  const schemas = Object.keys(thisInstance.structure);
  let tables = 0;
  schemas.map((schema) => { tables += Object.keys(thisInstance.structure[schema]).length; });

  return (
    <Card className="my-3">
      <CardBody>

        <Row>
          <Col lg="6">
            <div className="fieldset-label">Instance Name</div>
            <div className="fieldset full-height">
              {thisInstance.instance_name}
            </div>

            <div className="fieldset-label">Creation Date</div>
            <div className="fieldset full-height">
              {new Date(thisInstance.creation_date).toLocaleString()}
            </div>

            <div className="fieldset-label">Instance URL</div>
            <div className="fieldset full-height">
              {thisInstance.url}
            </div>

            {thisInstance.instance_region && (
              <>
                <div className="fieldset-label">Instance Region</div>
                <div className="fieldset full-height">
                  {thisInstance.instance_region}
                </div>
              </>
            )}

            <div className="fieldset-label">Instance RAM</div>
            <div className="fieldset full-height">
              {thisInstance.compute.ram}
            </div>

            <div className="fieldset-label">Instance Storage</div>
            <div className="fieldset full-height">
              {thisInstance.storage?.disk_space || 'NO STORAGE LIMIT'}
            </div>
          </Col>
          <Col lg="6">
            <div className="fieldset-label">Users</div>
            <div className="fieldset full-height">
              {thisInstance.users.length}
            </div>

            <div className="fieldset-label">Roles</div>
            <div className="fieldset full-height">
              {thisInstance.roles.length}
            </div>

            <div className="fieldset-label">Schemas</div>
            <div className="fieldset full-height">
              {schemas.length}
            </div>

            <div className="fieldset-label">Tables</div>
            <div className="fieldset full-height">
              {tables}
            </div>

            <div className="fieldset-label">Cluster Partners</div>
            <div className="fieldset full-height">
              {thisInstance.network.is_enabled ? thisInstance.network.outbound_connections.length : 'Clustering Is Not Enabled'}
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};
