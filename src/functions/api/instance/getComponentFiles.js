import queryInstance from '../queryInstance';
import { v4 as uuid } from 'uuid';

const COMPONENTS_DIRNAME = 'components';

function addFullPaths(fileTree, path) {

  if (!fileTree || !fileTree.entries) {
    return;
  }

  if (path === COMPONENTS_DIRNAME) {
    fileTree.path = path;
  }

  fileTree.key = uuid();

  for (const entry of fileTree.entries) {

    // add 3 properties to directory entry:
    // 1. project, which is the dir under component root on the instance
    // 2. path, which is the file path relative to the project.
    // 3. unique key for react dynamic list optimization
    const newPath = `${path}/${entry.name}`; 
    entry.project = newPath.split('/')[1]; // 'components/proj';
    entry.path = newPath;
    entry.key = uuid();

    addFullPaths(entry, newPath);

  };

}

export default async ({ auth, url }) => {

  const fileTree = await queryInstance({
    operation: { operation: 'get_component_files' },
    auth,
    url,
  });

  // for every entry, this appends a fullPath property
  // that is not present on the server response, but is useful
  // for improving front end performance and for saving the file back to server.

  const root = COMPONENTS_DIRNAME;
  addFullPaths(fileTree, root);

  return fileTree;

}
