import registrationInfo from '../../api/instance/registrationInfo';
import getFingerprint from '../../api/instance/getFingerprint';
import restartInstance from '../../api/instance/restartInstance';
import setLicense from '../../api/instance/setLicense';

import createLicense from '../../api/lms/createLicense';

import handleCloudInstanceUsernameChange from './handleCloudInstanceUsernameChange';
import clusterStatus from '../../api/instance/clusterStatus';

export default async ({ auth, instanceAuth, url, is_local, instance_id, compute_stack_id, compute }) => {
  try {
    if (!instanceAuth) {
      return {
        instance: 'PLEASE LOG IN',
        instanceError: true,
      };
    }

    let registration = await registrationInfo({ auth: instanceAuth, url });

    if (registration.error && registration.message === 'Login failed' && !is_local) {
      await handleCloudInstanceUsernameChange({ instance_id, instanceAuth, url });
      registration = await registrationInfo({ auth: instanceAuth, url });
    }

    if (registration.error && registration.message === 'Login failed') {
      return {
        instance: 'LOGIN FAILED',
        instanceError: true,
      };
    }

    if (registration.error) {
      return {
        instance: 'UNABLE TO CONNECT',
        instanceError: true,
      };
    }

    const cluster_status = await clusterStatus({ auth: instanceAuth, url });
    const clustering = cluster_status.is_enabled ? 'ENABLED' : 'NOT ENABLED';
    const registration_matches_stripe_plan = !compute || (registration.registered && registration.ram_allocation === compute.ram_allocation);

    if (registration_matches_stripe_plan) {
      return {
        instance: 'OK',
        instanceError: false,
        clustering,
      };
    }

    const fingerprint = await getFingerprint({ auth: instanceAuth, url });
    const license = await createLicense({ auth, payload: { compute_stack_id, customer_id: auth.customer_id, fingerprint } });

    if (license.result === false) {
      return {
        instance: 'ERROR CREATING LICENSE',
        instanceError: true,
        clustering,
      };
    }

    const apply = await setLicense({ auth: instanceAuth, key: license.key, company: license.company.toString(), url });

    if (apply.error) {
      return {
        instance: apply.message,
        instanceError: true,
        clustering,
      };
    }

    restartInstance({ auth: instanceAuth, url });

    return {
      instance: 'APPLYING LICENSE',
      instanceError: false,
      clustering,
    };
  } catch (e) {
    return {
      instance: 'COULD NOT CONNECT',
      instanceError: true,
    };
  }
};
