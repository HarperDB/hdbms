import queryInstance from '../queryInstance';
import instanceState from '../../state/instanceState';

export default async ({ auth, url, signal, from_date, to_date, currentJobCount, is_local, compute_stack_id, customer_id }) => {
  const result = await queryInstance({ operation: 'search_jobs_by_start_date', from_date, to_date }, auth, url, is_local, compute_stack_id, customer_id, signal);

  if (result.error && currentJobCount) {
    return instanceState.update((s) => {
      s.jobsError = true;
    });
  }

  if (!Array.isArray(result) || result.error) {
    return instanceState.update((s) => {
      s.jobs = [];
      s.jobsError = true;
    });
  }

  return instanceState.update((s) => {
    s.jobs = result.sort((a, b) => b.start_datetime - a.end_datetime);
    s.jobsError = false;
  });
};
