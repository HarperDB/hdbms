import queryInstance from '../queryInstance';
import { v4 as uuid } from 'uuid';

const COMPONENTS_DIRNAME = 'components';

// this 'addMetadata' logic probably belongs in src/functions/instance
// by convention
function addMetadata(fileTree, path) {

  if (!fileTree || !fileTree.entries) {
    return;
  }

  if (path === COMPONENTS_DIRNAME) {
    fileTree.path = COMPONENTS_DIRNAME;
    fileTree.key = uuid();
  }

  for (const entry of fileTree.entries) {

    /* 
     * adds 3 properties to directory entry:
     *   - project, which is the dir under component root on the instance
     *   - path, which is the file path relative to the project
     *   - unique key for react dynamic list optimization
     */

    const newPath = `${path}/${entry.name}`; 
    entry.project = newPath.split('/')[1];
    entry.path = newPath;
    entry.key = uuid();

    addMetadata(entry, newPath);

  };

}

export default async ({ auth, url }) => {

  const fileTree = await queryInstance({
    operation: { operation: 'get_component_files' },
    auth,
    url,
  });

  addMetadata(fileTree, COMPONENTS_DIRNAME);
  console.log(fileTree);

  return fileTree;

}
