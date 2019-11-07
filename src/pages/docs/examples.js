import React from 'react';
import { Card, CardBody, Button, Row, Col } from '@nio/ui-kit';

export default () => (
  <Card className="mb-3 mt-2">
    <CardBody>
      <h4>Examples</h4>
      <hr className="mt-2" />
      We&apos;ve published a Postman collection you can use to create and access sample data in HarperDB. It also has complete collection of all the operations our API can accept.<br /><br />

      Click the &quot;Run in Postman&quot; button to import them into Postman. Then run the &quot;QuickStart Examples&quot; from top to bottom to learn how to create, populate, and query our sample &quot;dog&quot; database.  Woof.<br /><br />

      Sample code is also available in many common languages in the sample code pane.  Select the language you want from the drop down and paste the code into your application.

      <hr />

      <div className="px-3">
        <Row>
          <Col md="6" className="mb-2">
            <Button block color="purple" href="https://docs.harperdb.io/" target="_blank" rel="noopener noreferrer">Click Here To Explore Our API</Button>
          </Col>
          <Col md="6" className="mb-2">
            <Button block color="purple" outline href="https://www.getpostman.com/" target="_blank" rel="noopener noreferrer">Click Here To Get Postman</Button>
          </Col>
        </Row>
      </div>

    </CardBody>
  </Card>
);
