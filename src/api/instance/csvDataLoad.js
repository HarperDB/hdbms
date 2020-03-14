import queryInstance from '../queryInstance';
import instanceState from '../../state/stores/instanceState';

export default async ({ schema, table, data, auth, url }) => {
  await queryInstance({ operation: 'csv_data_load', action: 'insert', schema, table, data }, auth, url);
  return instanceState.update((s) => { s.lastUpdate = Date.now(); });
};
