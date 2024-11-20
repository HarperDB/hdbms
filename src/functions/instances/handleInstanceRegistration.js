import registrationInfo from '../api/instance/registrationInfo';
import getFingerprint from '../api/instance/getFingerprint';
import restartInstance from '../api/instance/restartInstance';
import setLicense from '../api/instance/setLicense';
import createLicense from '../api/lms/createLicense';
import handleCloudInstanceUsernameChange from './handleCloudInstanceUsernameChange';
export default async ({
  auth,
  customerId,
  instanceAuth,
  url,
  isLocal,
  isSsl,
  cloudProvider,
  instanceId,
  computeStackId,
  compute,
  status
}) => {
  try {
    let registration = await registrationInfo({
      auth: instanceAuth,
      url
    });
    if (registration.error && cloudProvider && registration.type === 'catch') {
      return {
        status: 'CREATING INSTANCE',
        error: false,
        retry: true
      };
    }
    if ((registration.error && registration.message === 'Login failed' || registration.error === 'Login failed') && !isLocal) {
      const result = await handleCloudInstanceUsernameChange({
        instanceId,
        instanceAuth,
        url
      });
      if (result) {
        registration = await registrationInfo({
          auth: instanceAuth,
          url
        });
      } else {
        return {
          status: 'LOGIN FAILED',
          error: true,
          retry: false
        };
      }
    }
    if (registration.error && registration.message === 'Login failed' || registration.error === 'Login failed') {
      return {
        status: 'LOGIN FAILED',
        error: true,
        retry: false
      };
    }
    if (registration.error && ['UPDATING INSTANCE', 'CONFIGURING NETWORK'].includes(status)) {
      return {
        status,
        error: false,
        retry: true
      };
    }
    if (registration.error && isLocal && isSsl && registration.type === 'catch') {
      return {
        status: 'SSL ERROR',
        error: true,
        retry: true
      };
    }
    if (registration.error) {
      return {
        status: 'UNABLE TO CONNECT',
        error: true,
        retry: true
      };
    }
    const registrationMatchesStripePlan = !compute || registration.registered && registration.ramAllocation === compute.computeRam;
    if (registrationMatchesStripePlan) {
      return {
        status: 'OK',
        error: false,
        version: registration.version,
        retry: false
      };
    }
    const fingerprint = await getFingerprint({
      auth: instanceAuth,
      url
    });
    const license = await createLicense({
      auth,
      computeStackId,
      customerId,
      fingerprint
    });
    const apply = await setLicense({
      auth: instanceAuth,
      key: license.key,
      company: license.company.toString(),
      url
    });
    if (apply.error) {
      return {
        status: 'APPLYING LICENSE',
        error: false,
        version: registration.version,
        retry: true
      };
    }
    restartInstance({
      auth: instanceAuth,
      url
    });
    return {
      status: 'APPLYING LICENSE',
      error: false,
      version: registration.version,
      retry: true
    };
  } catch (e) {
    return {
      status: 'UNABLE TO CONNECT',
      error: true,
      retry: true
    };
  }
};