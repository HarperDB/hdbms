import React, { useEffect, useState } from 'react';
import { Card, CardBody, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../functions/state/appState';

import updatePassword from '../../functions/api/lms/updatePassword';
import Loader from '../shared/Loader';
import usePersistedUser from '../../functions/state/persistedUser';

function UpdatePassword() {
  const navigate = useNavigate();
  const auth = useStoreState(appState, (s) => s.auth);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  const [persistedUser, setPersistedUser] = usePersistedUser({});

  const setPasswordError = () => {
    setFormData({});
    setTimeout(() => setFormState({ error: '8 char min., 1 lower case, 1 upper case, 1 number, 1 special char.' }), 0);
  };

  // NOTE: Marketing requested to send a conversion event when this page is
  // loaded to indicate that the user in fact signed up.  Triggering here for now
  // because the only route to get here is via signup form.  if this becomes a destination
  // from multiple places, we need a solution that scopes the conversion call to the
  // correct action.
  useEffect(() => {
    if (window.lintrk) {
      window.lintrk('track', { conversion_id: 11485730 });
    }
  }, []);

  const submit = async () => {
    setFormState({ submitted: true });
    const { password } = formData;
    if (!password || !/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)) {
      setPasswordError();
    } else {
      setFormState({ processing: true });

      const newAuth = await updatePassword({ auth, user_id: auth.user_id, password });

      if (!newAuth || newAuth.passwordError) {
        setPasswordError();
      } else {
        setPersistedUser({ ...persistedUser, pass: password });
        setTimeout(navigate('/'), 100);
      }
    }
  };

  // eslint-disable-next-line
  useEffect(() => !formState.submitted && setFormState({}), [formData]);

  return (
    <div id="login-form">
      {formState.processing ? (
        <Loader header="setting account password" spinner relative />
      ) : (
        <>
          <Card className="mb-3">
            <CardBody onKeyDown={(e) => e.keyCode !== 13 || submit()}>
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
              <Button id="updateMyPassword" onClick={submit} disabled={formState.submitted} title="Add Account Password" block color="purple">
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
