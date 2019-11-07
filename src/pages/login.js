import React, { useState, useContext } from 'react';
import { Card, CardBody, Form, Input, Button, DropdownToggle, DropdownMenu, DropdownItem, Dropdown } from '@nio/ui-kit';
import { useHistory } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';
import urlRegex from 'url-regex';

import { HarperDBContext } from '../providers/harperdb';

export default () => {
  const { setAuthorization, authError, setAuthError, instances } = useContext(HarperDBContext);
  const history = useHistory();

  const [formValue, setFormValue] = useState({});
  const [showForm, setShowForm] = useState(!instances.length);
  const [dropdownOpen, setDropDownOpen] = useState(false);
  const [formError, setFormError] = useState(false);
  const [httpsError, setHttpsError] = useState(false);

  const validateFields = () => {
    if (!formValue.HDB_USER || !formValue.HDB_PASS || !formValue.HDB_CONNECTION) {
      setFormError('All fields must be completed.');
      return false;
    }
    if (!urlRegex().test(formValue.HDB_CONNECTION)) {
      setFormError('You must enter a valid URL');
      return false;
    }
    if (formValue.HDB_CONNECTION.indexOf('http:') !== -1 && window.location.protocol === 'https:') {
      setHttpsError(true);
      return false;
    }
    return true;
  };

  const setFieldValue = (name, value) => {
    formValue[name] = value;
    setFormValue(formValue);
    setAuthError(false);
    return setFormError(false);
  };

  const submitLogin = (e) => {
    e.preventDefault();
    return validateFields() ? setAuthorization({ auth: btoa(`${formValue.HDB_USER}:${formValue.HDB_PASS}`), url: formValue.HDB_CONNECTION }) : false;
  };

  let redirectTimeout = false;
  useAsyncEffect(() => { redirectTimeout = setTimeout(() => history.push('/'), 100); setAuthError(false); }, () => clearTimeout(redirectTimeout), []);

  return (
    <div id="login-form">
      <div id="login-logo" title="HarperDB Logo" />
      <Card className="mb-3 mt-2 dark">
        <CardBody>
          { showForm ? (
            <Form onSubmit={submitLogin}>
              <Input
                onChange={(e) => setFieldValue('HDB_CONNECTION', e.target.value)}
                className="mb-2 text-center"
                type="text"
                name="HDB_CONNECTION"
                title="Instance URL. example: http://localhost:9925"
                placeholder="URL: http://localhost:9925"
              />
              <Input
                onChange={(e) => setFieldValue('HDB_USER', e.target.value)}
                className="mb-2 text-center"
                type="text"
                name="HDB_USER"
                title="Instance Username"
                placeholder="Instance Username"
              />
              <Input
                onChange={(e) => setFieldValue('HDB_PASS', e.target.value)}
                className="mb-4 text-center"
                type="password"
                name="HDB_PASS"
                title="Instance Password"
                placeholder="Instance Password"
              />
              <Button title="Log Into HarperDB" block color="black">Log Into HarperDB</Button>
              {!!instances.length && (
                <Button block title="Choose Existing Instance" className="mt-3 text-white" color="link" onClick={() => setShowForm(false)}>choose existing instance</Button>
              )}
            </Form>
          ) : (
            <>
              <Dropdown isOpen={dropdownOpen} toggle={() => setDropDownOpen(!dropdownOpen)}>
                <DropdownToggle title="Choose an Existing Instance Dropdown" caret color="black">
                  <span>choose existing instance</span>
                </DropdownToggle>
                <DropdownMenu>
                  {instances.map((i) => (
                    <DropdownItem title={`Choose Instance ${i.url}`} key={JSON.stringify(i)} onClick={() => setAuthorization(i)}>
                      <span>{i.url}</span>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Button block title="Add New Instance" className="mt-3 text-white" color="link" onClick={() => setShowForm(true)}>add new instance</Button>
            </>
          )}
        </CardBody>
      </Card>
      <div id="login-error" className="text-small text-white text-center">
        {httpsError && (
          <div>
            Browsers usually deny access from https URLs to http URLs for security purposes.<br /><br />
            <Button block color="danger" className="text-white" href={`http://${window.location.host}`}>Switch to the http Studio</Button>
          </div>
        )}
        {formError || authError}&nbsp;
      </div>
    </div>
  );
};
