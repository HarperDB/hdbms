import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useNewInstance from '../../../functions/state/newInstance';
import appState from '../../../functions/state/appState';
import TypeAkamai from './TypeAkamai';
import TypeEnterprise from './TypeEnterprise';
import TypeVerizon from './TypeVerizon';
import TypeAWS from './TypeAWS';
function Type() {
  const navigate = useNavigate();
  const {
    customerId
  } = useParams();
  const [, setNewInstance] = useNewInstance({});
  const theme = useStoreState(appState, s => s.theme);
  const themes = useStoreState(appState, s => s.themes);
  const [formData, setFormData] = useState({});
  useAsyncEffect(() => {
    const {
      cloudProvider,
      isLocal,
      isWavelength,
      isAkamai
    } = formData;
    if (isLocal !== undefined) {
      setNewInstance({
        customerId,
        cloudProvider,
        isLocal,
        isWavelength,
        isAkamai
      });
      setTimeout(() => navigate(isLocal ? `/o/${customerId}/instances/new/meta_local` : `/o/${customerId}/instances/new/meta_cloud`), 0);
    }
  }, [formData]);
  return <Row>
      {themes.length > 1 && <>
          <Col xs="12" xl="4" className="instance-form-card-holder">
            <TypeAWS setFormData={setFormData} />
          </Col>
          <Col xs="12" xl="4" className="instance-form-card-holder">
            <TypeVerizon setFormData={setFormData} />
          </Col>
          <Col xs="12" xl="4" className="instance-form-card-holder">
            <TypeEnterprise setFormData={setFormData} />
          </Col>
        </>}
      {theme === 'akamai' && <>
          <Col xs="12" xl="6" className="instance-form-card-holder">
            <TypeAkamai setFormData={setFormData} />
          </Col>
          <Col xs="12" xl="6" className="instance-form-card-holder">
            <TypeEnterprise setFormData={setFormData} />
          </Col>
        </>}
      {theme === 'verizon' && <>
          <Col xs="12" xl="6" className="instance-form-card-holder">
            <TypeVerizon setFormData={setFormData} />
          </Col>
          <Col xs="12" xl="6" className="instance-form-card-holder">
            <TypeEnterprise setFormData={setFormData} />
          </Col>
        </>}
    </Row>;
}
export default Type;