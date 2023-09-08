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
  // for saving to server, which requires skipping root /components dir
  // and treating /components/projects dir as project name.
  // filepath is <project>/path/to/file.js

  return absolutePath.split('/').slice(2).join('/');

}

function ManageIndex({ refreshCustomFunctions, loading }) {
  const registration = useStoreState(instanceState, (s) => s.registration);
  const { fileTree } = useStoreState(instanceState, (s) => s.custom_functions); 
  const [majorVersion, minorVersion] = (registration?.version || '').split('.');
  const supportsApplicationsAPI = parseFloat(`${majorVersion}.${minorVersion}`) >= 4.2;

    // save file to instance
  async function saveCodeToInstance(selectedFile) {

    // TODO: check filepath.

    const filepathRelativeToProjectDir = selectedFile.path.split('/').slice(2).join('/'); 
    console.log('on save file check:', { selectedFile }, filepathRelativeToProjectDir);
    const payload = {
      auth,
      url: applicationsAPIUrl,
      project: selectedFile.project,
      file: filepathRelativeToProjectDir,
      payload: selectedFile.content
    };

    await setComponentFile(payload);

    await refreshCustomFunctions();

  }

  async function renameFolder(newFolderName, info) {

    // TODO: check filepath.
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

    // TODO: check filepath.
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

  async function selectNewFile(selectedFile) {

    console.log('select new file path check: ', selectedFile?.path);

    const { path, project, name } = selectedFile;
    // TODO: check filepath.
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

    // TODO: check filepath.
    const newProject = !parentFolder;

    /*
     * to create a base-level (project) folder, we have to call addComponent which creates a project.
     * to create a subdir of a project, we call add component file w/ no payload or name extension
     */

    if (newProject) {

      console.log('add new folder path check, new project: ', {
        auth,
        url: applicationsAPIUrl,
        project: newFolderName
      })

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
      console.log('add new folder path check, add project to file: ', {
        auth,
        url: applicationsAPIUrl,
        project: newFolderName
      })
    }

    await refreshCustomFunctions();

  }

  async function onDeploy(arg) {
  }

  async function createNewFile(newFilename, parentFolder) {
    // FIXME BUG: fileTree metadata schema differs from what you're getting back here.
    // TODO: figure out a consistent translation from server rep to in-app rep and 
    // stick to it.

    // TODO: check filepath.
    const { path, project } = parentFolder;
    const relativeDirpath = getRelativeFilepath(path);
    const relativeFilepath = relativeDirpath ? `${relativeDirpath}/${newFilename}` : newFilename;
    const payload = '';

    // NOTE: to server, path is everything after '/components/project' in /components/project/path/to/file.js
    // in IDE land, path is full, aka, 'components/project/path/to/file.js'.

    await setComponentFile({
      auth,
      url: applicationsAPIUrl,
      project,
      file: relativeFilepath,
      payload
    });

    console.log('inside manageIndex#createNewFile: ', {
      content: payload,
      path: [parentFolder.path, newFilename].join('/'),
      project,
    });

    await refreshCustomFunctions();

    return {
      content: payload,
      path: [parentFolder.path, newFilename].join('/'),
      project,
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
