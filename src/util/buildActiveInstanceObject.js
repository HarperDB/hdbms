import queryInstance from './queryInstance';
import getInstanceDataStructure from './getInstanceDataStructure';
import getInstanceClusterStatus from './getInstanceClusterStatus';

export default async ({ instance_id, instanceAuths, lmsData }) => {
  const auth = { ...instanceAuths[instance_id], ...lmsData.instances.find((i) => i.id === instance_id) };
  const instance = await queryInstance({ operation: 'describe_all' }, auth);

  if (instance.error) {
    return instance;
  }
  const structure = getInstanceDataStructure(instance);
  const network = await getInstanceClusterStatus(auth);
  return { auth, structure, network };
};
