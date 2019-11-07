import React, { useState, useContext } from 'react';
import { Card, CardBody, Form, Input, Button, DropdownToggle, DropdownMenu, DropdownItem, Dropdown } from '@nio/ui-kit';
import { useHistory } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';
const urlRegex = require('url-regex');

import { HarperDBContext } from '../providers/harperdb';

export default () => {
  const { setAuthorization, authError, setAuthError, instances } = useContext(HarperDBContext);
  const history = useHistory();

  const [formValue, setFormValue] = useState({});
  const [showForm, setShowForm] = useState(!instances.length);
  const [dropdownOpen, setDropDownOpen] = useState(false);
  const [formError, setFormError] = useState(false);

  const setFieldValue = (name, value) => {
    formValue[name] = value;
    setFormValue(formValue);
    setAuthError(false);
    setFormError(false);
  };

  const submitLogin = (e) => {
    e.preventDefault();
    if (!formValue.HDB_USER || !formValue.HDB_PASS || !formValue.HDB_CONNECTION) {
      setFormError('All fileds must be completed.');
      return false;
    }
    if (!urlRegex().test(formValue.HDB_CONNECTION)) {
      setFormError('You must enter a valid URL');
      return false;
    }

    setAuthorization({ auth: btoa(`${formValue.HDB_USER}:${formValue.HDB_PASS}`), url: formValue.HDB_CONNECTION });
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
                className={`mb-2 text-center`}
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
                  choose existing instance
                </DropdownToggle>
                <DropdownMenu>
                  {instances.map((i) => (
                    <DropdownItem title={`Choose Instance ${i.url}`} key={JSON.stringify(i)} onClick={() => setAuthorization(i)}>{i.url}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Button block title="Add New Instance" className="mt-3 text-white" color="link" onClick={() => setShowForm(true)}>add new instance</Button>
            </>
          )}
        </CardBody>
      </Card>
      <div className="text-white text-center text-smaller">{formError || authError}&nbsp;</div>
    </div>
  );
};
