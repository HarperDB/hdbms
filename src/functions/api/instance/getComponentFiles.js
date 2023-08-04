import queryInstance from '../queryInstance';
import { v4 as uuid } from 'uuid';

function addFullPaths(fileTree, root='/') {

  if (!fileTree || !fileTree.entries) return;
  fileTree.key = uuid();

  for (const entry of fileTree.entries) {

    // add two properties to directory entry
    // 1. project, which is the dir under component root on the instance
    // 2. path, which is the file path relative to the project.
    const currentPath = root === '/' ? entry.name : `${root}/${entry.name}`; 
    const [ project, ...pathSegments ] = currentPath.split('/'); 
    entry.project = project;
    entry.path = pathSegments.join('/');
    entry.key = uuid();

    addFullPaths(entry, currentPath);

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

  addFullPaths(fileTree);

  return fileTree;

}
