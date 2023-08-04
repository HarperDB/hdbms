import queryInstance from '../queryInstance';

function addFullPaths(fileTree, root='') {

  if (!fileTree || !fileTree.entries) return;

  for (const entry of fileTree.entries) {

    const currentPath = root === '' ? entry.name : `${root}/${entry.name}`; 
    entry.fullPath = currentPath;

    addFullPaths(entry, currentPath);

  };

}

export default async ({ auth, url }) => {

  const fileTree = await queryInstance({
    operation: { operation: 'get_component_files' },
    auth,
    url,
  });

  addFullPaths(fileTree);

  return fileTree;

}
