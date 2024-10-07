import registrationInfo from '../api/instance/registrationInfo';
import handleCloudInstanceUsernameChange from './handleCloudInstanceUsernameChange';

export default async ({ instanceAuth, url, is_local, is_ssl, cloud_provider, instance_id, status }) => {
  try {
    let registration = await registrationInfo({ auth: instanceAuth, url });

    if (registration.error && cloud_provider && registration.type === 'catch') {
      return {
        status: 'CREATING INSTANCE',
        error: false,
        retry: true,
      };
    }

    if (((registration.error && registration.message === 'Login failed') || registration.error === 'Login failed') && !is_local) {
      const result = await handleCloudInstanceUsernameChange({ instance_id, instanceAuth, url });

      if (result) {
        registration = await registrationInfo({ auth: instanceAuth, url });
      } else {
        return {
          status: 'LOGIN FAILED',
          error: true,
          retry: false,
        };
      }
    }

    if ((registration.status === 401) || registration.error === 'Login failed') {
      return {
        status: 'LOGIN FAILED',
        error: true,
        retry: false,
      };
    }

    if (registration.error && ['UPDATING INSTANCE', 'CONFIGURING NETWORK'].includes(status)) {
      return {
        status,
        error: false,
        retry: true,
      };
    }

    if (registration.error && is_local && is_ssl && registration.type === 'catch') {
      return {
        status: 'SSL ERROR',
        error: true,
        retry: true,
      };
    }

    if (registration.error) {
      return {
        status: 'UNABLE TO CONNECT',
        error: true,
        retry: false,
      };
    }

    return {
      status: 'OK',
      error: false,
      version: registration.version,
      retry: false,
    };
    // eslint-disable-next-line
  } catch (e) {
    return {
      status: 'UNABLE TO CONNECT',
      error: true,
      retry: true,
    };
  }
};
