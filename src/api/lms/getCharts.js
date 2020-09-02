import queryLMS from '../queryLMS';
import instanceState from '../../state/instanceState';
import addError from './addError';
import config from '../../config';

export default async ({ auth, customer_id, compute_stack_id }) => {
  let response = null;

  try {
    response = await queryLMS({
      endpoint: 'getCharts',
      method: 'POST',
      payload: { customer_id, compute_stack_id, user_id: auth.user_id },
      auth,
    });

    if (!response.error) {
      instanceState.update((s) => {
        s.charts = response;
      });
    }

    if (response.message === 'Network request failed') {
      instanceState.update((s) => {
        s.charts = [
          {
            id: 'temp-chart-identification-value',
            compute_stack_id: 'compute-stack-b7ff16bc-1597419076419',
            customer_id: 'b7ff16bc',
            labelAttribute: 'dog_name',
            name: 'dog weights',
            query: 'SELECT d.dog_name, d.weight_lbs, d.owner_name, b.name, b.section FROM dev.dog AS d INNER JOIN dev.breed AS b ON d.breed_id = b.id  ORDER BY d.dog_name',
            seriesAttributes: ['weight_lbs'],
            shared: true,
            type: 'line',
            user_id: '3eceb5ff-9bac-4e3b-8429-95f097eeb1bd',
          },
          {
            id: 'temp-chart-identification-value2',
            compute_stack_id: 'compute-stack-b7ff16bc-1597419076419',
            customer_id: 'b7ff16bc',
            labelAttribute: false,
            name: 'average dog weight',
            query: 'select AVG(weight_lbs) as average_weight from dev.dog',
            seriesAttributes: ['average_weight'],
            shared: false,
            type: 'single value',
            user_id: '3eceb5ff-9bac-4e3b-8429-95f097eeb1bd',
          },
        ];
      });
    }

    return response;
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lms_api_url,
      operation: 'getCharts',
      request: { customer_id, compute_stack_id, user_id: auth.user_id },
      error: { catch: e.toString() },
      customer_id,
    });
  }
};
