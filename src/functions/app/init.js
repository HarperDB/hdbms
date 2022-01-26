import getCurrentVersion from '../api/lms/getCurrentVersion';
import getProducts from '../api/lms/getProducts';
import getRegions from '../api/lms/getRegions';
import getWavelengthRegions from '../api/lms/getWavelengthRegions';
import getPostManCollection from '../examples/getPostManCollection';
import appState from '../state/appState';
import refreshUser from './refreshUser';

export default ({ auth, history, setFetchingUser, setPersistedUser, controller }) => {
  const canonical = document.querySelector('link[rel="canonical"]');

  history.listen(() => {
    canonical.href = window.location.href;
  });

  if (['/sign-up', '/reset-password', '/resend-registration-email'].includes(history.location.pathname)) {
    setFetchingUser(false);
    return setPersistedUser({});
  }

  if (['/sign-in'].includes(history.location.pathname)) {
    history.push('/');
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

  const unsubscribeAuth = appState.subscribe(
    (s) => ({ newAuth: s.auth, newTheme: s.theme }),
    ({ newAuth: { email, pass }, newTheme }) => {
      setPersistedUser({ email, pass, theme: newTheme });
      if (!email && controller) controller.abort();
    }
  );

  appState.update((s) => {
    s.auth = { email: auth?.email, pass: auth?.pass };
    s.theme = auth?.theme;
  });

  return unsubscribeAuth;
};
