import React from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col } from 'reactstrap';
import instanceState from '../../../functions/state/instanceState';
import ContentContainer from '../../shared/ContentContainer';
import CopyableText from '../../shared/CopyableText';
import config from '../../../config';
function Details({
  clusterNodeName,
  instanceConfig
}) {
  const url = useStoreState(instanceState, s => s.url);
  const auth = useStoreState(instanceState, s => s.auth);
  const totalPriceStringWithInterval = useStoreState(instanceState, s => s.totalPriceStringWithInterval);
  const compute = useStoreState(instanceState, s => s.compute);
  const prepaidCompute = useStoreState(instanceState, s => !!s.computeSubscriptionId);
  const prepaidStorage = useStoreState(instanceState, s => !!s.storageSubscriptionId);
  const creationDate = useStoreState(instanceState, s => s.creationDate);
  const instanceRegion = useStoreState(instanceState, s => s.instanceRegion);
  const storage = useStoreState(instanceState, s => s.storage);
  const isLocal = useStoreState(instanceState, s => s.isLocal);
  const authHeader = auth?.user ? `${btoa(`${auth.user}:${auth.pass}`)}` : '...';
  const iopsString = isLocal ? 'HARDWARE LIMIT' : `${storage?.iops}`;
  const formattedCreationDate = creationDate ? new Date(creationDate).toLocaleDateString() : 'N/A';
  const {
    hostname
  } = window.location;
  const urlObject = new URL(url);
  const operationsApiURL = !config.isLocalStudio ? `${instanceConfig.operationsApi?.network?.securePort ? 'https://' : 'http://'}${urlObject.hostname}:${instanceConfig.operationsApi?.network?.securePort || instanceConfig.operationsApi?.network?.port}` : `${instanceConfig.operationsApi?.network?.securePort ? 'https://' : 'http://'}${hostname}:${instanceConfig.operationsApi?.network?.securePort || instanceConfig.operationsApi?.network?.port}`;
  const applicationsApiURL = !config.isLocalStudio ? `${instanceConfig.http?.securePort ? 'https://' : 'http://'}${urlObject.hostname}:${instanceConfig.http?.securePort || instanceConfig.http?.port}` : `${instanceConfig.http?.securePort ? 'https://' : 'http://'}${hostname}:${instanceConfig.http?.securePort || instanceConfig.http?.port}`;
  const version = useStoreState(instanceState, s => s.registration?.version);
  const [major, minor] = version?.split('.') || [];
  const versionAsFloat = parseFloat(`${major}.${minor}`);
  return <>
      <span className="floating-card-header">instance overview</span>
      <Card className="mt-3 mb-4 instance-details">
        <CardBody>
          <Row>
            <Col md="4" xs="12">
              <ContentContainer header="Instance URL" className="mb-3">
                <div className="nowrap-scroll">
                  <CopyableText text={operationsApiURL} />
                </div>
              </ContentContainer>
            </Col>
            <Col md="4" xs="12">
              <ContentContainer header={`${versionAsFloat >= 4.2 ? 'Applications' : 'Custom Functions'} URL`} className="mb-3">
                <div className="nowrap-scroll">
                  <CopyableText text={applicationsApiURL} />
                </div>
              </ContentContainer>
            </Col>
            <Col md="4" xs="12">
              <ContentContainer header="Instance Node Name (for clustering)" className="mb-3">
                <div className="nowrap-scroll">{clusterNodeName ? <CopyableText text={clusterNodeName} /> : 'clustering not enabled'}</div>
              </ContentContainer>
            </Col>
            {!config.isLocalStudio && <>
                <Col md="4" xs="12">
                  <ContentContainer header="Instance API Auth Header (this user)" className="mb-3">
                    <div className="nowrap-scroll">
                      <CopyableText text={authHeader} beforeText="Basic " obscure />
                    </div>
                  </ContentContainer>
                </Col>

                <Col md="2" sm="4" xs="6">
                  <ContentContainer header="Created" className="mb-3">
                    <div className="nowrap-scroll">{formattedCreationDate}</div>
                  </ContentContainer>
                </Col>
                {instanceRegion && <Col md="2" sm="4" xs="6">
                    <ContentContainer header="Region" className="mb-3">
                      <div className="nowrap-scroll">{instanceRegion}</div>
                    </ContentContainer>
                  </Col>}
                <Col md="2" sm="4" xs="6">
                  <ContentContainer header="Total Price" className="mb-3">
                    <div className="nowrap-scroll">{totalPriceStringWithInterval}</div>
                  </ContentContainer>
                </Col>
                <Col md="2" sm="4" xs="6">
                  <ContentContainer header="RAM" className="mb-3">
                    <div className="nowrap-scroll">
                      {compute?.computeRamString} {prepaidCompute && '(PREPAID)'}
                    </div>
                  </ContentContainer>
                </Col>
                {!isLocal && <>
                    <Col md="2" sm="4" xs="6">
                      <ContentContainer header="Storage" className="mb-3 text-nowrap">
                        <div className="nowrap-scroll">
                          {storage?.dataVolumeSizeString} {prepaidStorage && '(PREPAID)'}
                        </div>
                      </ContentContainer>
                    </Col>
                    <Col md="2" sm="4" xs="6">
                      <ContentContainer header="Disk IOPS" className="mb-3 text-nowrap">
                        <div className="nowrap-scroll">{iopsString}</div>
                      </ContentContainer>
                    </Col>
                  </>}
              </>}
          </Row>
        </CardBody>
      </Card>
    </>;
}
export default Details;