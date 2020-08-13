import React from 'react';
import { Card, CardBody, Row } from 'reactstrap';

import DriverCard from './driverCard';

export default () => (
  <main id="support">
    <span className="floating-card-header">Download Drivers</span>
    <Card className="my-3">
      <CardBody>
        <Row>
          <DriverCard icon="file-excel-o" name="Excel (Windows exe)" docs="xls" urls={[{ link: 'https://dou1lpys04in1.cloudfront.net/Excel/setup.exe' }]} />
          <DriverCard icon="coffee" name="JDBC" docs="jdbc" urls={[{ link: 'https://dou1lpys04in1.cloudfront.net/JDBC/setup.zip' }]} />
          <DriverCard icon="windows" name="ODBC Windows" docs="odbc" urls={[{ link: 'https://dou1lpys04in1.cloudfront.net/ODBC_Windows/odbc_windows.exe' }]} />
          <DriverCard icon="apple" name="ODBC Mac" docs="odbc" urls={[{ link: 'https://dou1lpys04in1.cloudfront.net/ODBC_Mac/odbc_mac.dmg' }]} />
          <DriverCard
            icon="linux"
            name="ODBC Linux (RPM)"
            docs="odbc"
            urls={[
              { label: 'i686', link: 'https://dou1lpys04in1.cloudfront.net/ODBC_Linux/setup.i686.rpm' },
              { label: 'x86_64', link: 'https://dou1lpys04in1.cloudfront.net/ODBC_Linux/setup.x86_64.rpm' },
            ]}
          />
          <DriverCard
            icon="linux"
            name="ODBC Linux (DEB)"
            docs="odbc"
            urls={[
              { label: 'i686', link: 'https://dou1lpys04in1.cloudfront.net/ODBC_Linux/setup.i686.deb' },
              { label: 'x86_64', link: 'https://dou1lpys04in1.cloudfront.net/ODBC_Linux/setup.x86_64.deb' },
            ]}
          />
          <DriverCard icon="windows" name="ADO" docs="ado" urls={[{ link: 'https://dou1lpys04in1.cloudfront.net/ADO/setup_ado.exe' }]} />
          <DriverCard icon="windows" name="BizTalk" docs="bt" urls={[{ link: 'https://dou1lpys04in1.cloudfront.net/BizTalk/setup.exe' }]} />
          <DriverCard icon="code" name="Cmdlets" docs="rcmd" urls={[{ link: 'https://dou1lpys04in1.cloudfront.net/Cmdlets/setup.exe' }]} />
          <DriverCard icon="windows" name="SSIS" docs="rssis" urls={[{ link: 'https://dou1lpys04in1.cloudfront.net/SSIS/ssis.exe' }]} />
        </Row>
      </CardBody>
    </Card>
  </main>
);
