import getCurrentVersion from '../api/lms/getCurrentVersion';
import getProducts from '../api/lms/getProducts';
import getRegions from '../api/lms/getRegions';
import getWavelengthRegions from '../api/lms/getWavelengthRegions';
import getPostManCollection from '../examples/getPostManCollection';
import appState from '../state/appState';
import refreshUser from './refreshUser';

export default ({ auth, location, navigate, setFetchingUser, setPersistedUser, controller }) => {

  if (['/sign-up', '/reset-password', '/resend-registration-email'].includes(location.pathname)) {
    setFetchingUser(false);
    return setPersistedUser({});
  }

  if (['/sign-in'].includes(location.pathname)) {
    navigate('/');
  }

  if (!auth?.email) {
    setFetchingUser(false);
  } else {
    refreshUser({ auth, controller, setFetchingUser, loggingIn: true });
  }

  getCurrentVersion();
  getProducts();
  getRegions();
  getWavelengthRegions();
  getPostManCollection();

  // TODO: when is this called? this is when the theme is set.
  const unsubscribeAuth = appState.subscribe(
    (s) => ({ newAuth: s.auth, newTheme: s.theme }),
    ({ newAuth: { email, pass }, newTheme }) => {
      setPersistedUser({ email, pass, theme: newTheme });
      if (!email && controller) controller.abort();
    }
  );

  appState.update((s) => {
    s.auth = { email: auth?.email, pass: auth?.pass };
  });

  return unsubscribeAuth;
};
