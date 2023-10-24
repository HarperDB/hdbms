import { v4 as uuid } from 'uuid';
import queryInstance from '../queryInstance';

// this 'addMetadata' logic probably belongs in src/functions/instance
// by convention
function addMetadata(fileTree, path, rootDir) {

  if (!fileTree || !fileTree.entries) {
    return;
  }

  if (path === rootDir) {
    fileTree.path = rootDir;
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
    const [ , project ] = newPath.split('/');
    entry.project = project;
    entry.path = newPath;
    entry.key = uuid();

    addMetadata(entry, newPath, rootDir);

  };

}

export default async ({ auth, url }) => {

  const fileTree = await queryInstance({
    operation: { operation: 'get_components' },
    auth,
    url,
  });

  addMetadata(fileTree, fileTree.name, fileTree.name);

  return fileTree;

}
