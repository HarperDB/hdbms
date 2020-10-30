import React from 'react';
import { Card, CardBody, Row, Col, CardImg } from 'reactstrap';

import MigratorCard from './migratorCard';

import Screenshot1 from '../../../assets/images/migrator/screenshot1.png';
import Screenshot2 from '../../../assets/images/migrator/screenshot2.png';
import Screenshot3 from '../../../assets/images/migrator/screenshot3.png';

export default () => (
  <main id="support">
    <span className="floating-card-header">HarperDB Migrator</span>
    <Card className="my-3">
      <CardBody>
        The HarperDB Migrator allows you to quickly and easily replicate data from your existing database into HarperDB.
        <br />
        <br />
        <b>
          <i>We currently support migration from MongoDB, but we&apos;re working on other platforms.</i>
        </b>
        <hr />
        <Row>
          <MigratorCard icon="apple" name="MacOS DMG" urls={[{ link: 'https://harperdb.io/download/migrator/mac' }]} />
          <MigratorCard icon="windows" name="Windows exe" urls={[{ link: 'https://harperdb.io/download/migrator/windows' }]} />
          <MigratorCard icon="linux" name="Linux AppImage" urls={[{ link: 'https://harperdb.io/download/migrator/linux' }]} />
        </Row>
        <hr />
        <Row>
          <Col md="4" xs="12">
            <b className="d-block my-3">Step 1: Configure Connection</b>
            <CardImg top width="100%" src={Screenshot1} alt="HarperDB Migrator Screenshot" />
          </Col>
          <Col md="4" xs="12">
            <b className="d-block my-3">Step 2: Select Entities For Migration</b>
            <CardImg top width="100%" src={Screenshot2} alt="HarperDB Migrator Screenshot" />
          </Col>
          <Col md="4" xs="12">
            <b className="d-block my-3">Step 3: Click Start Migration</b>
            <CardImg top width="100%" src={Screenshot3} alt="HarperDB Migrator Screenshot" />
          </Col>
        </Row>
      </CardBody>
    </Card>
  </main>
);
