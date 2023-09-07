import React from 'react';
import { useStoreState } from 'pullstate';

import instanceState from '../../../../functions/state/instanceState';
import getComponentFile from '../../../../functions/api/instance/getComponentFile';
import setComponentFile from '../../../../functions/api/instance/setComponentFile';
import addComponent from '../../../../functions/api/instance/addComponent';
import dropComponent from '../../../../functions/api/instance/dropComponent';

import {default as ApplicationsIDE} from '../../../shared/webide/WebIDE';
import CustomFunctionsEditor from './CustomFunctionsEditor';

const auth = { user: 'alex', pass: 'alex' };
const applicationsAPIUrl = 'http://localhost:9925';

/*
 * Parse the relative path, which is what the components api expects.
 *
 * note: While 'components' root is not shown in the app,
 * the full path is components/<project name>/relative/path/to/file.js
 */

function getRelativeFilepath(absolutePath) {

  return absolutePath.split('/').slice(2).join('/');

}

function ManageIndex({ refreshCustomFunctions, loading }) {
  const registration = useStoreState(instanceState, (s) => s.registration);
  const { fileTree } = useStoreState(instanceState, (s) => s.custom_functions); 
  const [majorVersion, minorVersion] = (registration?.version || '').split('.');
  const supportsApplicationsAPI = parseFloat(`${majorVersion}.${minorVersion}`) >= 4.2;

    // save file to instance
  async function saveCodeToInstance(selectedFile) {

    const payload = {
      auth,
      url: applicationsAPIUrl,
      project: selectedFile.project,
      file: getRelativeFilepath(selectedFile.path), //TODO: doublecheck this path logic
      payload: selectedFile.content
    };

    await setComponentFile(payload);

    await refreshCustomFunctions();

  }

  async function renameFolder(newFolderName, info) {

    /*
    const fileContent = await getComponentFile({
      url: applicationsAPIUrl,
      auth,
      project: info.project,
      file: getRelativeFilepath(info.path)
    })
    */

  }

  async function renameFile(newFileName, info) {

    const { path, content, project } = info;
    const parentDir = getRelativeFilepath(path).split('/').slice(0, -1).join('/');
    const newFilenameRelativePath = parentDir ? `${parentDir}/${newFileName}` : newFileName;

    await dropComponent({
      auth,
      url: applicationsAPIUrl,
      project,
      file: getRelativeFilepath(path)
    });

    await setComponentFile({
      auth,
      url: applicationsAPIUrl,
      project,
      file: newFilenameRelativePath,
      payload: content
    })

    refreshCustomFunctions();

  }

  async function selectNewFile({ path, project, name }) {

    const newFile = getRelativeFilepath(path);
    const { message: fileContent } = await getComponentFile({
      auth,
      url: applicationsAPIUrl,
      project,
      file: newFile
    });

    return {
      content: fileContent,
      path,
      project,
      name
    };

  }

  async function deleteFile(f) {
    console.log(f);

    await dropComponent({
      auth,
      url: applicationsAPIUrl,
      project: f.project,
      file: getRelativeFilepath(f.path)
    });

    await refreshCustomFunctions();

  }

  async function deleteFolder({ path, project }) {

    const targetDirpath = getRelativeFilepath(path);

    // if we're deleting as top-level directory, that's a project,
    // so don't pass a file. otherwise pass project name and file/dir
    // relative to project name as 'file'.
    if (targetDirpath.length > 0) {
      await dropComponent({
        auth,
        url: applicationsAPIUrl,
        project,
        file: targetDirpath
      });
    } else {
      await dropComponent({
        auth,
        url: applicationsAPIUrl,
        project
      });
    }

    await refreshCustomFunctions();

  }

  async function createNewFolder(newFolderName, parentFolder) {

    const newProject = !parentFolder;

    /*
     * to create a base-level (project) folder, we have to call addComponent which creates a project.
     * to create a subdir of a project, we call add component file w/ no payload or name extension
     */

    if (newProject) {
      await addComponent({
        auth,
        url: applicationsAPIUrl,
        project: newFolderName
      })
    } else {

      const { path, project } = parentFolder;
      const relativeDirpath = getRelativeFilepath(path);
      const relativeFilepath = relativeDirpath ? `${relativeDirpath}/${newFolderName}` : newFolderName;

      await setComponentFile({
        auth,
        url: applicationsAPIUrl,
        project,
        file: relativeFilepath
      })
    }

    await refreshCustomFunctions();

  }

  async function onDeploy(arg) {
    console.log({ arg });
  }

  async function createNewFile(newFilename, parentFolder) {

    const { path, project } = parentFolder;
    const relativeDirpath = getRelativeFilepath(path);
    const relativeFilepath = relativeDirpath ? `${relativeDirpath}/${newFilename}` : newFilename;
    const payload = '';

    await setComponentFile({
      auth,
      url: applicationsAPIUrl,
      project,
      file: relativeFilepath,
      payload
    });

    await refreshCustomFunctions();

    return {
      project,
      path: relativeFilepath,
      content: payload
    };

  }

  return supportsApplicationsAPI ?

    <ApplicationsIDE
      fileTree={fileTree} 
      onSave={saveCodeToInstance}
      onUpdate={refreshCustomFunctions}
      onAddFile={createNewFile}
      onAddFolder={createNewFolder}
      onDeploy={onDeploy}
      onDeleteFile={deleteFile}
      onDeleteFolder={deleteFolder}
      onFileSelect={selectNewFile}
      onFileRename={renameFile}
      onFolderRename={renameFolder} /> :

    <CustomFunctionsEditor
      refreshCustomFunctions={refreshCustomFunctions}
      loading={loading} />

}

export default ManageIndex;
