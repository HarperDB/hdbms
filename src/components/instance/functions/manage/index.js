import React from 'react';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router';

import appState from '../../../../functions/state/appState';
import instanceState from '../../../../functions/state/instanceState';
import getComponentFile from '../../../../functions/api/instance/getComponentFile';
import setComponentFile from '../../../../functions/api/instance/setComponentFile';
import addComponent from '../../../../functions/api/instance/addComponent';
import packageComponent from '../../../../functions/api/instance/packageComponent';
import dropComponent from '../../../../functions/api/instance/dropComponent';
import deployComponent from '../../../../functions/api/instance/deployComponent';
import restartInstance from '../../../../functions/api/instance/restartInstance';

import useInstanceAuth from '../../../../functions/state/instanceAuths';

import {default as ApplicationsIDE} from '../../../shared/webide/WebIDE';
import CustomFunctionsEditor from './CustomFunctionsEditor';

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

function getDeployTargets(instanceList, instanceAuthList, thisCsId, auth) {

  return instanceList.reduce((memo, i) => {

    if (i['compute_stack_id'] === thisCsId) {
      return memo;
    }

    const csId = i['compute_stack_id'];
    const deployTarget = instanceAuthList[csId];

    if (!deployTarget?.version) {
      return memo;
    }

    const [ major, minor, ...patchEtc ] = deployTarget.version.split('.'); 

    // exclude < 4.2

    if (parseInt(major, 10) >= 4 && parseInt(minor, 10) >= 2) {

      memo.push({ 
        auth,
        instance: i
      });

    } 

    return memo;

  }, []);

}

function ManageIndex({ refreshCustomFunctions, loading }) {

  const { compute_stack_id } = useParams();
  const registration = useStoreState(instanceState, (s) => s.registration);
  const { fileTree } = useStoreState(instanceState, (s) => s.custom_functions); 
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const [majorVersion, minorVersion] = (registration?.version || '').split('.');
  const supportsApplicationsAPI = parseFloat(`${majorVersion}.${minorVersion}`) >= 4.2;
  const instances = useStoreState(appState, (s) => s.instances);
  const [instanceAuths] = useInstanceAuth({});

  // save file to instance
  async function saveCodeToInstance(selectedFile) {

    const filepathRelativeToProjectDir = selectedFile.path.split('/').slice(2).join('/'); 
    const payload = {
      auth,
      url,
      project: selectedFile.project,
      file: filepathRelativeToProjectDir,
      payload: selectedFile.content
    };

    await setComponentFile(payload);

    await refreshCustomFunctions();

  }

  async function renameFolder(newFolderName, info) {

    // not supported by instance api yet.

    /*
    const fileContent = await getComponentFile({
      url,
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
      url,
      project,
      file: getRelativeFilepath(path)
    });

    await setComponentFile({
      auth,
      url,
      project,
      file: newFilenameRelativePath,
      payload: content
    })

    refreshCustomFunctions();

  }

  async function selectNewFile(selectedFile) {

    const { path, project, name } = selectedFile;
    const newFile = getRelativeFilepath(path);
    const { message: fileContent } = await getComponentFile({
      auth,
      url,
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
      url,
      project: f.project,
      file: getRelativeFilepath(f.path)
    });

    await refreshCustomFunctions();

  }

  async function deletePackage({ name: project }) {

    await dropComponent({
      auth,
      url,
      project
    });

    await refreshCustomFunctions();

  }

  async function deleteFolder({ path, project }) {


    const targetDirpath = getRelativeFilepath(path);

    // if we're deleting a top-level directory, that's a project,
    // so don't pass a file. otherwise pass project name and file/dir
    // relative to project name as 'file'.
    if (targetDirpath.length > 0) {
      await dropComponent({
        auth,
        url,
        project,
        file: targetDirpath
      });
    } else {
      await dropComponent({
        auth,
        url,
        project
      });
    }

    await refreshCustomFunctions();

  }

  async function createNewProject(newProjectName) {

    await addComponent({
      auth,
      url,
      project: newProjectName
    });

    //await restartInstance({ auth, url });
    await refreshCustomFunctions();

  }

  async function createNewProjectFolder(newFolderName, parentFolder) {

    const { path, project } = parentFolder;
    const relativeDirpath = getRelativeFilepath(path);
    const relativeFilepath = relativeDirpath ? `${relativeDirpath}/${newFolderName}` : newFolderName;

    await setComponentFile({
      auth,
      url,
      project,
      file: relativeFilepath
    })

    await refreshCustomFunctions();

  }

  async function installPackage(projectName, packageUrl) {

    await deployComponent({
      auth,
      url,
      project: projectName,
      packageUrl
    });

    await restartInstance({
      auth,
      url,
    });

    await refreshCustomFunctions();

  }

  async function createNewFile(newFilename, parentFolder) {

    const { path, project } = parentFolder;
    const relativeDirpath = getRelativeFilepath(path);
    const relativeFilepath = relativeDirpath ? `${relativeDirpath}/${newFilename}` : newFilename;
    const payload = '';

    // NOTE: to server, path is everything after '/components/project' in /components/project/path/to/file.js
    // in IDE land, path is full, aka, 'components/project/path/to/file.js'.

    await setComponentFile({
      auth,
      url,
      project,
      file: relativeFilepath,
      payload
    });

    await refreshCustomFunctions();

    return {
      content: payload,
      path: [parentFolder.path, newFilename].join('/'),
      project,
    };

  }

  async function deployProject({ project, deployTarget }) {

    const {
      auth: otherInstanceAuth,
      instance: otherInstance
    } = deployTarget;

    const { payload } = await packageComponent({
      auth,
      url,
      project: project.name
    });

    // deploy to targetInstance
    await deployComponent({
      auth: otherInstanceAuth,
      url: otherInstance.url,
      project: project.name,
      payload
    })

    // restart targetInstance
    await restartInstance({
      auth: otherInstanceAuth,
      url: otherInstance.url
    });

    // restart this instance
    await restartInstance({
      auth,
      url
    });

    await refreshCustomFunctions();

  }

  return supportsApplicationsAPI ?
    <ApplicationsIDE
      fileTree={fileTree} 
      deployTargets={
        getDeployTargets(instances, instanceAuths, compute_stack_id, auth)
      }
      onSave={saveCodeToInstance}
      onUpdate={refreshCustomFunctions}
      onAddFile={createNewFile}
      onAddProject={createNewProject}
      onAddProjectFolder={createNewProjectFolder}
      onInstallPackage={installPackage}
      onDeployProject={deployProject}
      onDeleteFile={deleteFile}
      onDeleteFolder={deleteFolder}
      onDeletePackage={deletePackage}
      onFileSelect={selectNewFile}
      onFileRename={renameFile}
      onFolderRename={renameFolder} />
    :
    <CustomFunctionsEditor
      refreshCustomFunctions={refreshCustomFunctions}
      loading={loading} />

}

export default ManageIndex;
