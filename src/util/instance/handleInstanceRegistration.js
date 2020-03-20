import registrationInfo from '../../api/instance/registrationInfo';
import getFingerprint from '../../api/instance/getFingerprint';
import addLicense from '../../api/lms/addLicense';
import setLicense from '../../api/instance/setLicense';
import removeLicense from '../../api/lms/removeLicense';
import restartInstance from '../../api/instance/restartInstance';

import handleCloudInstanceUsernameChange from './handleCloudInstanceUsernameChange';
import clusterStatus from '../../api/instance/clusterStatus';

export default async ({ auth, instanceAuth, url, is_local, instance_id, compute, storage, license, compute_stack_id, stripe_product_id }) => {
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

    if (registration.registered) {
      return {
        instance: 'OK',
        instanceError: false,
        license: `${compute.ram} RAM / ${storage ? `${storage.disk_space} Storage` : 'NO STORAGE LIMIT'}`,
        licenseError: false,
        clustering,
      };
    }

    const fingerprint = await getFingerprint({ auth: instanceAuth, url });

    if (!license) {
      license = await addLicense({ auth, payload: { compute_stack_id, customer_id: auth.customer_id, stripe_product_id, fingerprint } });
    }

    let apply = await setLicense({ auth: instanceAuth, key: license.license, company: license.company.toString(), url });

    if (apply.error && apply.message === 'There was an error parsing the license key.') {
      await removeLicense({ auth, payload: { compute_stack_id, customer_id: auth.customer_id, record_id: license.record_id } });
      license = await addLicense({ auth, payload: { compute_stack_id, customer_id: auth.customer_id, stripe_product_id, fingerprint } });
      apply = await setLicense({ auth: instanceAuth, key: license.license, company: license.company.toString(), url });
    }

    if (apply.error) {
      return {
        license: apply.message,
        licenseError: true,
        clustering,
      };
    }

    restartInstance({ auth: instanceAuth, url });

    return {
      instance: 'RESTARTING INSTANCE',
      instanceError: true,
      clustering,
    };
  } catch (e) {
    return {
      instance: 'COULD NOT CONNECT',
      instanceError: true,
    };
  }
};
