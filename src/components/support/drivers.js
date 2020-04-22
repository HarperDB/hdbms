import React from 'react';
import { Card, CardBody, Row, Col, Button } from '@nio/ui-kit';

export default () => (
  <>
    <span className="text-white mb-2 floating-card-header">Download Drivers</span>
    <Card className="my-3">
      <CardBody>
        <Row>
          <Col lg="3" md="4" sm="6" xs="12" className="mb-3">
            <Card>
              <CardBody className="text-center">
                <i className="fa fa-2x fa-file-excel-o text-purple" />
                <b className="d-block my-4">Excel (Windows exe)</b>
                <Button href="https://dou1lpys04in1.cloudfront.net/Excel/setup.exe" block color="purple">
                  Download
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="4" sm="6" xs="12" className="mb-3">
            <Card>
              <CardBody className="text-center">
                <i className="fa fa-2x fa-coffee text-purple" />
                <b className="d-block my-4">JDBC</b>
                <Button href="https://dou1lpys04in1.cloudfront.net/JDBC/setup.zip" block color="purple">
                  Download
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="4" sm="6" xs="12" className="mb-3">
            <Card>
              <CardBody className="text-center">
                <i className="fa fa-2x fa-windows text-purple" />
                <b className="d-block my-4">ODBC Windows</b>
                <Button href="https://dou1lpys04in1.cloudfront.net/ODBC_Windows/odbc_windows.exe" block color="purple">
                  Download
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="4" sm="6" xs="12" className="mb-3">
            <Card>
              <CardBody className="text-center">
                <i className="fa fa-2x fa-apple text-purple" />
                <b className="d-block my-4">ODBC Mac</b>
                <Button href="https://dou1lpys04in1.cloudfront.net/ODBC_Mac/odbc_mac.dmg" block color="purple">
                  Download
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="4" sm="6" xs="12" className="mb-3">
            <Card>
              <CardBody className="text-center">
                <i className="fa fa-2x fa-linux text-purple" />
                <b className="d-block my-4">ODBC Linux (RPM)</b>
                <Row>
                  <Col>
                    <Button href="https://dou1lpys04in1.cloudfront.net/ODBC_Linux/setup.i686.rpm" block color="purple">
                      i686 RPM
                    </Button>
                  </Col>
                  <Col>
                    <Button href="https://dou1lpys04in1.cloudfront.net/ODBC_Linux/setup.x86_64.rpm" block color="purple">
                      x86_64 RPM
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="4" sm="6" xs="12" className="mb-3">
            <Card>
              <CardBody className="text-center">
                <i className="fa fa-2x fa-linux text-purple" />
                <b className="d-block my-4">ODBC Linux (DEB)</b>
                <Row>
                  <Col>
                    <Button href="https://dou1lpys04in1.cloudfront.net/ODBC_Linux/setup.i686.deb" block color="purple">
                      i686 DEB
                    </Button>
                  </Col>
                  <Col>
                    <Button href="https://dou1lpys04in1.cloudfront.net/ODBC_Linux/setup.x86_64.deb" block color="purple">
                      x86_64 DEB
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="4" sm="6" xs="12" className="mb-3">
            <Card>
              <CardBody className="text-center">
                <i className="fa fa-2x fa-windows text-purple" />
                <b className="d-block my-4">ADO</b>
                <Button href="https://dou1lpys04in1.cloudfront.net/ADO/setup_ado.exe" block color="purple">
                  Download
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="4" sm="6" xs="12" className="mb-3">
            <Card>
              <CardBody className="text-center">
                <i className="fa fa-2x fa-windows text-purple" />
                <b className="d-block my-4">BizTalk</b>
                <Button href="https://dou1lpys04in1.cloudfront.net/BizTalk/setup.exe" block color="purple">
                  Download
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="4" sm="6" xs="12" className="mb-3">
            <Card>
              <CardBody className="text-center">
                <i className="fa fa-2x fa-code text-purple" />
                <b className="d-block my-4">Cmdlets</b>
                <Button href="https://dou1lpys04in1.cloudfront.net/Cmdlets/setup.exe" block color="purple">
                  Download
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="4" sm="6" xs="12" className="mb-3">
            <Card>
              <CardBody className="text-center">
                <i className="fa fa-2x fa-windows text-purple" />
                <b className="d-block my-4">SSIS</b>
                <Button href="https://dou1lpys04in1.cloudfront.net/SSIS/ssis.exe" block color="purple">
                  Download
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </CardBody>
    </Card>
  </>
);
