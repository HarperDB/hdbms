import React from 'react';
import { Card, CardBody, Row } from 'reactstrap';

import DriverCard from './DriverCard';

function DriversIndex() {
  return (
    <main id="support">
      <span className="floating-card-header">Download Drivers</span>
      <Card className="my-3">
        <CardBody>
          <Row>
            <DriverCard
              icon="chart-bar"
              name="Power BI (Windows exe)"
              docs="powerbi"
              urls={[
                {
                  link: '/drivers/HarperDBPowerBIConnector.exe',
                },
              ]}
            />
            <DriverCard
              icon="chart-bar"
              name="Tableau"
              docs="tableau"
              urls={[
                {
                  label: 'Windows',
                  link: '/drivers/HarperDBTableauConnector.exe',
                },
                {
                  label: 'Unix/Linux/Mac',
                  link: '/drivers/HarperDBTableauConnector_UnixLinuxMac.zip',
                },
              ]}
            />
            <DriverCard icon="file-excel-o" name="Excel (Windows exe)" docs="xls" urls={[{ link: 'https://cdatabuilds.s3.amazonaws.com/support/FHXG-A_7867.exe' }]} />
            <DriverCard icon="coffee" name="JDBC" docs="jdbc" urls={[{ link: 'https://cdatabuilds.s3.amazonaws.com/support/FARG-V_7867setup.zip' }]} />
            <DriverCard icon="windows" name="ODBC Windows" docs="odbc" urls={[{ link: 'https://cdatabuilds.s3.amazonaws.com/support/FHDG-A_7867.exe' }]} />
            <DriverCard icon="apple" name="ODBC Mac" docs="odbc" urls={[{ link: 'https://cdatabuilds.s3.amazonaws.com/support/FHDG-M_7867.dmg' }]} />
            <DriverCard
              icon="linux"
              name="ODBC Linux (RPM)"
              docs="odbc"
              urls={[
                { label: 'i686', link: 'https://cdatabuilds.s3.amazonaws.com/support/FHDG-U_7867_setup.i686.rpm' },
                { label: 'x86_64', link: 'https://cdatabuilds.s3.amazonaws.com/support/FHDG-U_7867_setup.x86_64.rpm' },
              ]}
            />
            <DriverCard
              icon="linux"
              name="ODBC Linux (DEB)"
              docs="odbc"
              urls={[
                { label: 'i686', link: 'https://cdatabuilds.s3.amazonaws.com/support/FHDG-U_7867_setup.i686.deb' },
                { label: 'x86_64', link: 'https://cdatabuilds.s3.amazonaws.com/support/FHDG-U_7867_setup.x86_64.deb' },
              ]}
            />
            <DriverCard icon="windows" name="ADO" docs="ado" urls={[{ link: 'https://cdatabuilds.s3.amazonaws.com/support/FHRG-A_7687.exe' }]} />
            <DriverCard icon="windows" name="BizTalk" docs="bt" urls={[{ link: 'https://cdatabuilds.s3.amazonaws.com/support/FHZG-A_7867.exe' }]} />
            <DriverCard icon="code" name="Cmdlets" docs="rcmd" urls={[{ link: 'https://cdatabuilds.s3.amazonaws.com/support/FHMG-A_7867.exe' }]} />
            <DriverCard icon="windows" name="SSIS" docs="rssis" urls={[{ link: 'https://cdatabuilds.s3.amazonaws.com/support/FHSG-A_7867.exe' }]} />
          </Row>
        </CardBody>
      </Card>
    </main>
  );
}

export default DriversIndex;
