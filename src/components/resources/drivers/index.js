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
                  link: 'https://harperdb-drivers.s3.amazonaws.com/Power+BI+(Windows+exe)/setup.exe',
                },
              ]}
            />
            <DriverCard
              icon="chart-bar"
              name="Tableau"
              docs="tableau"
              urls={[
                { label: 'Windows', link: 'https://harperdb-drivers.s3.amazonaws.com/Tableau/setup.exe' },
                { label: 'Unix/Linux/Mac', link: 'https://harperdb-drivers.s3.amazonaws.com/Tableau/setup.jar' },
              ]}
            />
            <DriverCard icon="file-excel-o" name="Excel (Windows exe)" docs="xls" urls={[{ link: 'https://harperdb-drivers.s3.amazonaws.com/Excel+(Windows+exe)/setup.exe' }]} />
            <DriverCard
              icon="coffee"
              name="JDBC"
              docs="jdbc"
              urls={[
                { label: 'Windows', link: 'https://harperdb-drivers.s3.amazonaws.com/JDBC+(Windows+exe)/setup.exe' },
                { label: 'Mac', link: 'https://harperdb-drivers.s3.amazonaws.com/JDBC+(Mac+Dmg)/setup.dmg' },
                { label: 'Driver JAR', link: 'https://harperdb-drivers.s3.amazonaws.com/JDBC+(Driver+Jar)/cdata.jdbc.harperdb.jar' },
              ]}
            />
            <DriverCard icon="windows" name="ODBC Windows" docs="odbc" urls={[{ link: 'https://harperdb-drivers.s3.amazonaws.com/ODBC+Windows/setup.exe' }]} />
            <DriverCard icon="apple" name="ODBC Mac" docs="odbc" urls={[{ link: 'https://harperdb-drivers.s3.amazonaws.com/ODBC+Mac/setup.dmg' }]} />
            <DriverCard
              icon="linux"
              name="ODBC Linux (RPM)"
              docs="odbc"
              urls={[
                { label: 'i686', link: 'https://harperdb-drivers.s3.amazonaws.com/ODBC+Linux+(RPM)/setup.i686.rpm' },
                { label: 'x86_64', link: 'https://harperdb-drivers.s3.amazonaws.com/ODBC+Linux+(RPM)/setup.x86_64.rpm' },
              ]}
            />
            <DriverCard
              icon="linux"
              name="ODBC Linux (DEB)"
              docs="odbc"
              urls={[
                { label: 'i686', link: 'https://harperdb-drivers.s3.amazonaws.com/ODBC+Linux+(DEB)/setup.i686.deb' },
                { label: 'x86_64', link: 'https://harperdb-drivers.s3.amazonaws.com/ODBC+Linux+(DEB)/setup.x86_64.deb' },
              ]}
            />
            <DriverCard icon="windows" name="ADO" docs="ado" urls={[{ link: 'https://harperdb-drivers.s3.amazonaws.com/ADO/setup.exe' }]} />
            <DriverCard icon="windows" name="BizTalk" docs="bt" urls={[{ link: 'https://harperdb-drivers.s3.amazonaws.com/BizTalk/setup.exe' }]} />
            <DriverCard icon="code" name="Cmdlets" docs="rcmd" urls={[{ link: 'https://harperdb-drivers.s3.amazonaws.com/Cmdlets/setup.exe' }]} />
            <DriverCard icon="windows" name="SSIS" docs="rssis" urls={[{ link: 'https://harperdb-drivers.s3.amazonaws.com/SSIS/setup.exe' }]} />
          </Row>
        </CardBody>
      </Card>
    </main>
  );
}

export default DriversIndex;
