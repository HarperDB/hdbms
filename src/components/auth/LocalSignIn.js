import React, { useState } from 'react';
import { Card, CardBody, Form, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import Loader from '../shared/Loader';
import useInstanceAuth from '../../functions/state/instanceAuths';
import userInfo from '../../functions/api/instance/userInfo';
import appState from '../../functions/state/appState';
function SignIn() {
  const url = useStoreState(appState, s => s.instances.find(i => i.computeStackId === 'local')?.url);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const navigate = useNavigate();
  const submit = async () => {
    setFormState({
      submitted: true
    });
    const {
      user,
      pass
    } = formData;
    if (!user || !pass) {
      setFormState({
        error: 'All fields are required'
      });
    } else {
      const result = await userInfo({
        auth: {
          user,
          pass
        },
        url
      });
      if (result.error && result.type === 'catch') {
        setFormState({
          error: 'SSL ERROR. ACCEPT SELF-SIGNED CERT?',
          url
        });
      } else if (result.error && result.message === 'Login failed' || result.error === 'Login failed') {
        setFormState({
          error: 'Login failed. Using instance credentials?',
          url: 'https://harperdb.io/docs/harperdb-studio/instances/#instance-login'
        });
      } else if (result.error) {
        setFormState({
          error: result.message || result.error
        });
      } else {
        setInstanceAuths({
          ...instanceAuths,
          local: {
            valid: true,
            user: formData.user,
            pass: formData.pass,
            super: result.role.permission.superUser,
            structure: result.role.permission.structureUser
          }
        });
        setTimeout(navigate('/o/local/i/local/browse'), 0);
      }
    }
  };
  const keyDown = e => {
    if (e.code === 'Enter') {
      setFormState({
        submitted: true
      });
    }
  };
  return <div id="login-form">
      {formState.submitted ? <Loader header="signing in" spinner relative /> : <>
          <Card className="mb-3">
            <CardBody onKeyDown={e => e.keyCode !== 13 || submit()}>
              <Form>
                <div className="instructions">Please sign into HarperDB</div>
                <Input id="username" autoComplete="username" onChange={e => setFormData({
              ...formData,
              user: e.target.value
            })} className="text-center mb-1" type="text" title="instance user" placeholder="instance user" value={formData.user || ''} disabled={formState.submitted} onKeyDown={keyDown} />
                <Input id="password" name="password" autoComplete="current-password" onChange={e => setFormData({
              ...formData,
              pass: e.target.value
            })} className="text-center mb-2" type="password" title="instance password" placeholder="instance password" disabled={formState.submitted} value={formData.pass || ''} onKeyDown={keyDown} />
                <Button id="signIn" onClick={submit} title="Sign In My Account" block color="purple" disabled={formState.submitted}>
                  Sign In
                </Button>
              </Form>
            </CardBody>
          </Card>
          {formState.error && <a href={formState.url || null} target="_blank" rel="noopener noreferrer" className="text-bold text-center text-small text-danger d-block mt-2 text-nowrap  text-decoration-none">
              <span className="text-danger">{formState.error}</span>
              {formState.url && <i className="ms-2 fa fa-lg fa-external-link-square text-danger" />}
            </a>}
        </>}
    </div>;
}
export default SignIn;