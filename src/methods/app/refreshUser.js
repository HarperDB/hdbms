import getUser from '../../api/lms/getUser';

export default async ({ auth, loggingIn = false, showPasswordUpdate, controller, setFetchingUser }) => {
  if (auth?.email && auth?.pass && !showPasswordUpdate) {
    controller = new AbortController();
    setFetchingUser(true);
    await getUser({ ...auth, loggingIn, signal: controller.signal });
    setFetchingUser(false);
  }
};
