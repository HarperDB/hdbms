import registrationInfo from '../api/instance/registrationInfo';
import getFingerprint from '../api/instance/getFingerprint';
import restartInstance from '../api/instance/restartInstance';
import setLicense from '../api/instance/setLicense';

import createLicense from '../api/lms/createLicense';
import handleCloudInstanceUsernameChange from './handleCloudInstanceUsernameChange';

export default async ({ auth, customer_id, instanceAuth, url, is_local, instance_id, compute_stack_id, compute, status }) => {
  try {
    let registration = await registrationInfo({ auth: instanceAuth, url, is_local, compute_stack_id, customer_id });

    if (registration.error && registration.message === 'Login failed' && !is_local) {
      const result = await handleCloudInstanceUsernameChange({
        instance_id,
        instanceAuth,
        url,
        is_local,
        compute_stack_id,
        customer_id,
      });

      if (result) {
        registration = await registrationInfo({ auth: instanceAuth, url, is_local, compute_stack_id, customer_id });
      } else {
        return {
          status: 'LOGIN FAILED',
          error: true,
          retry: false,
        };
      }
    }

    if (registration.error && registration.message === 'Login failed') {
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

    if (registration.error && status === 'UPDATING INSTANCE') {
      return {
        status: 'FINALIZING UPDATE',
        error: false,
        retry: true,
      };
    }

    if (registration.error) {
      return {
        status: 'UNABLE TO CONNECT',
        error: true,
        retry: true,
      };
    }

    const registration_matches_stripe_plan = !compute || (registration.registered && registration.ram_allocation === compute.compute_ram);

    if (registration_matches_stripe_plan) {
      return {
        status: 'OK',
        error: false,
        version: registration.version,
        retry: false,
      };
    }

    const fingerprint = await getFingerprint({ auth: instanceAuth, url, is_local, compute_stack_id, customer_id });
    const license = await createLicense({
      auth,
      compute_stack_id,
      customer_id,
      fingerprint,
    });

    const apply = await setLicense({
      auth: instanceAuth,
      key: license.key,
      company: license.company.toString(),
      url,
      is_local,
      compute_stack_id,
      customer_id,
    });

    if (apply.error) {
      return {
        status: 'APPLYING LICENSE',
        error: false,
        version: registration.version,
        retry: true,
      };
    }

    restartInstance({
      auth: instanceAuth,
      url,
      is_local,
      compute_stack_id,
      customer_id,
    });

    return {
      status: 'APPLYING LICENSE',
      error: false,
      version: registration.version,
      retry: true,
    };
  } catch (e) {
    return {
      status: 'UNABLE TO CONNECT',
      error: true,
      retry: true,
    };
  }
};
