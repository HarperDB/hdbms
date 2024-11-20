import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import config from '../../../config';
import generateInstanceAlarmDetails from '../../instances/generateInstanceAlarmDetails';
export default async ({
  auth,
  customerId,
  signal,
  currentAlarmsLength
}) => {
  let response = null;
  try {
    response = await queryLMS({
      endpoint: 'getAlarms',
      method: 'POST',
      payload: {
        customerId
      },
      signal,
      auth
    });
    if (response.error && currentAlarmsLength) {
      return appState.update(s => {
        s.alarmsError = true;
      });
    }
    if (!Array.isArray(response) || response.error) {
      return appState.update(s => {
        s.alarms = [];
        s.alarmsError = true;
      });
    }
    const alarmsArray = [...response].sort((a, b) => b.date - a.date);
    const alarms = Object.assign({}, ...alarmsArray.map(i => {
      const instanceAlarms = response?.filter(a => a.computeStackId === i.computeStackId);
      return {
        [i.computeStackId]: {
          alarms: instanceAlarms,
          alarmCounts: generateInstanceAlarmDetails({
            alarms: instanceAlarms.filter(a => a.date + config.alarmBadgeThreshold * 1000 > Date.now())
          })
        }
      };
    }));
    return appState.update(s => {
      s.alarms = alarms;
      s.alarmsError = false;
    });
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lmsApiUrl,
      operation: 'getAlarms',
      request: {
        customerId
      },
      error: {
        catch: e.toString()
      },
      customerId
    });
  }
};