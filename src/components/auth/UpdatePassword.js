import React, { useEffect, useState } from 'react';
import { Card, CardBody, Input, Button } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../functions/state/appState';

import updatePassword from '../../functions/api/lms/updatePassword';
import Loader from '../shared/Loader';

function UpdatePassword() {
  const navigate = useNavigate();
  const auth = useStoreState(appState, (s) => s.auth);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});

  const setPasswordError = () => {
    setFormData({});
    setTimeout(() => setFormState({ error: '8 char min., 1 lower case, 1 upper case, 1 number, 1 special char.' }), 0);
  };

  useAsyncEffect(async () => {
    const { submitted, processing } = formState;
    if (submitted && !processing) {
      const { password } = formData;

      if (!password || !/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)) {
        setPasswordError();
      } else {
        setFormState({ processing: true });
        updatePassword({ auth, ...auth, password });
      }
    }
  }, [formState]);

  useEffect(() => {
    if (auth?.passwordSuccess) {
      navigate('/');
    } else if (auth?.passwordError) {
      setPasswordError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  useAsyncEffect(() => !formState.submitted && setFormState({}), [formData]);

  return (
    <div id="login-form">
      {formState.processing ? (
        <Loader header="adding account password" spinner relative />
      ) : (
        <>
          <Card className="mb-3">
            <CardBody onKeyDown={(e) => e.keyCode !== 13 || setFormState({ submitted: true })}>
              <div className="instructions">
                Add an account password
                <br />
                <br />
                {formState.error ? (
                  <i className="text-small text-danger text-bold">{formState.error}</i>
                ) : (
                  <i className="text-small text-bold">8 char min., 1 lower case, 1 upper case, 1 number, 1 special char.</i>
                )}
              </div>
              <Input
                id="password1"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={formState.submitted}
                className="mb-2 text-center"
                type="password"
                title="password"
                placeholder="add password"
              />
              <Button id="updateMyPassword" onClick={() => setFormState({ submitted: true })} disabled={formState.submitted} title="Add Account Password" block color="purple">
                Add Account Password
              </Button>
            </CardBody>
          </Card>
          <div className="login-nav-link">&nbsp;</div>
        </>
      )}
    </div>
  );
}

export default UpdatePassword;
