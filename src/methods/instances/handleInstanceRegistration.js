import registrationInfo from '../../api/instance/registrationInfo';
import getFingerprint from '../../api/instance/getFingerprint';
import restartInstance from '../../api/instance/restartInstance';
import setLicense from '../../api/instance/setLicense';

import createLicense from '../../api/lms/createLicense';

import handleCloudInstanceUsernameChange from './handleCloudInstanceUsernameChange';
import clusterStatus from '../../api/instance/clusterStatus';

export default async ({ auth, instanceAuth, url, is_local, instance_id, compute_stack_id, compute, status }) => {
  try {
    let registration = await registrationInfo({ auth: instanceAuth, url });

    if (registration.error && registration.message === 'Login failed' && !is_local) {
      const result = await handleCloudInstanceUsernameChange({
        instance_id,
        instanceAuth,
        url,
      });

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

    const cluster_status = await clusterStatus({ auth: instanceAuth, url });
    const clustering = cluster_status.is_enabled ? 'ENABLED' : 'NOT ENABLED';
    const registration_matches_stripe_plan = !compute || (registration.registered && registration.ram_allocation === compute.ram_allocation);

    if (registration_matches_stripe_plan) {
      return {
        status: 'OK',
        error: false,
        clustering,
        version: registration.version,
        retry: false,
      };
    }

    const fingerprint = await getFingerprint({ auth: instanceAuth, url });
    const license = await createLicense({
      auth,
      compute_stack_id,
      customer_id: auth.customer_id,
      fingerprint,
    });

    const apply = await setLicense({
      auth: instanceAuth,
      key: license.key,
      company: license.company.toString(),
      url,
    });

    if (apply.error) {
      return {
        status: 'APPLYING LICENSE',
        error: false,
        clustering,
        version: registration.version,
        retry: true,
      };
    }

    restartInstance({
      auth: instanceAuth,
      url,
    });

    return {
      status: 'APPLYING LICENSE',
      error: false,
      clustering,
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
