import instanceState from '../state/instanceState';
import describeAll from '../api/instance/describeAll';
import buildInstanceDataStructure from './buildInstanceDataStructure';

export default async ({ auth, url }) => {
  const schema = await describeAll({ auth, url });

  if (schema.error) {
    return {
      error: 'Could not log into instance',
    };
  }

  const { structure, defaultBrowseURL } = buildInstanceDataStructure(schema);

  instanceState.update((s) => {
    s.auth = auth;
    s.structure = structure;
    s.defaultBrowseURL = defaultBrowseURL;
    s.loading = false;
  });

  return {
    error: false,
  };
};
