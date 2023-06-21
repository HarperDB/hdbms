import React from 'react';
import { Card, CardBody } from 'reactstrap';

function ClusterDisabledIndex() {
  return (
    <>
      <div className="floating-card-header text-end">&nbsp;</div>
      <Card className="my-3">
        <CardBody>
          <div className="empty-prompt narrow">
            <i className="fa fa-bullhorn fa-3x text-success" />
            <div className="mt-3 text-bold">Cloud Clustering Disabled</div>
            <div className="mt-3">
              We&apos;ve temporarily disabled clustering for HarperDB Cloud instances using version 4.0 and up due to an issue with AWS Load Balancers. 
              <ul>
                <li>You may still cluster user-managed 4.x instances together</li>
                <li>You may still use all other 4.x instance features</li>
                <li>We expect the networking issue to be resolve soon</li>
              </ul>
              If you need help, please <a href="mailto:hello@harperdb.io">contact sales</a>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default ClusterDisabledIndex;
