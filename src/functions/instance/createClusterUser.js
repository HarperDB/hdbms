import addUser from '../api/instance/addUser';

export default async ({ username, password, role, auth, url }) => addUser({ username, password, role, auth, url });
