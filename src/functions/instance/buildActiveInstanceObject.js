import instanceState from '../state/instanceState';
import describeAll from '../api/instance/describeAll';
import buildInstanceDataStructure from './buildInstanceDataStructure';

export default async ({ instances, auth, compute_stack_id }) => {
  const thisInstance = instances.find((i) => i.compute_stack_id === compute_stack_id);

  if (!thisInstance) {
    return {
      error: true,
    };
  }

  const schema = await describeAll({ auth, url: thisInstance.url });

  if (schema.error) {
    return {
      error: 'Could not log into instance',
    };
  }

  const { structure, defaultBrowseURL } = buildInstanceDataStructure(schema);

  const activeInstanceObject = Object.entries({
    ...thisInstance,
    auth,
    structure,
    defaultBrowseURL,
    loading: false,
  }).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});

  instanceState.update(() => activeInstanceObject);

  return {
    error: false,
  };
};
