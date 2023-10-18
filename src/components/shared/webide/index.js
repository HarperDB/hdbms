import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import FileBrowser from './FileBrowser';
import FileMenu, {
  AddFileButton,
  AddProjectFolderButton,
  AddProjectButton,
  DeleteFolderButton,
  DeleteFileButton,
  InstallPackageButton
} from './FileMenu';
import EditorMenu, { SaveButton } from './EditorMenu';
import Editor from './Editor';
import EditorWindow, {
  EDITOR_WINDOWS,
  PackageInstallWindow,
  DefaultWindow,
  NoFileSelectedWindow,
  NameFileWindow,
  DeleteFileWindow,
  DeleteFolderWindow,
  DeletePackageWindow,
  NameProjectFolderWindow,
  NameProjectWindow,
  PackageDetailsWindow
} from './EditorWindow';

function WebIDE({
  deployTargets, // FIXME: does this belong here?
  fileTree,
  onSave,
  onAddFile,
  onAddProjectFolder,
  onAddProject,
  onDeleteFolder,
  onDeleteFile,
  onDeletePackage,
  onDeployProject,
  onFileSelect,
  onFileRename,
  onFolderRename,
  onInstallPackage,
  onUpdate,
}) {

  const [ selectedFolder, setSelectedFolder ] = useState(null);
  const [ selectedFile, setSelectedFile ] = useState(null);       // selectedFile = { content, path: /components/project/rest/of/path.js, project }
  const [ selectedPackage, setSelectedPackage ] = useState(null); // selectedPackage = { name, url }
  const [ editingFileName, setEditingFileName ] = useState(false);
  const [ showInstallPackageWindow, setShowInstallPackageWindow ] = useState(false);
  const [ activeEditorWindow, setActiveEditorWindow ] = useState(EDITOR_WINDOWS.DEFAULT_WINDOW);
  const [ previousActiveEditorWindow, setPreviousActiveEditorWindow ] = useState(null);

  const hasProjects = fileTree?.entries?.length > 0;
  const canAddFile = Boolean(hasProjects && selectedFolder);  // can only add a file if a target folder is selected
  const canDeleteFolder = Boolean(hasProjects && (selectedFolder || selectedPackage));  // can only delete a folder if a target folder is selected
  const canAddProjectFolder = Boolean(selectedFolder); // can only add a folder toa project if a target folder is selected

  async function addProject(newProjectName) {
    onAddProject(newProjectName);
    updateActiveEditorWindow(previousActiveEditorWindow, activeEditorWindow);
  }

  async function addProjectFolder(newFolderName) {
    onAddProjectFolder(newFolderName, selectedFolder)
    // go back to prev window
    updateActiveEditorWindow(previousActiveEditorWindow, activeEditorWindow);
  }

  async function installPackage(packageUrl, projectName, deployTargets) {

    await onInstallPackage(packageUrl, projectName, deployTargets);

    setSelectedPackage(null);
    updateActiveEditorWindow(EDITOR_WINDOWS.DEFAULT_WINDOW, activeEditorWindow);

  }

  async function addFile(newFilename) {
    const fileInfo = await onAddFile(newFilename, selectedFolder);

    setSelectedFile(fileInfo);
    updateActiveEditorWindow(EDITOR_WINDOWS.CODE_EDITOR_WINDOW, activeEditorWindow);
  }

  function updateActiveEditorWindow(to, from) {
    // TODO: figure out correct logic here.
    setActiveEditorWindow(to);
    setPreviousActiveEditorWindow(from);
  }

  function toDefaultWindow() {
    updateActiveEditorWindow(EDITOR_WINDOWS.DEFAULT_WINDOW, activeEditorWindow);
  }

  function backToPreviousWindow() {
    // TODO: this needs some thought.  unexpected 'no action' behavior.
    updateActiveEditorWindow(previousActiveEditorWindow || EDITOR_WINDOWS.DEFAULT_WINDOW, activeEditorWindow);
  }

  // updates current in memory code
  function updateInMemoryCodeFile(updatedCode) {

    const update = {
      ...selectedFile,
      content: updatedCode
    };

    setSelectedFile(update);

  }

  return (
    <Row className="web-ide">
      <Col md="3" className="file-browser-outer-container">
        <div className="file-browser-inner-container" >
          <FileMenu>
            <AddProjectButton
              onAddProject={
                () => {
                  updateActiveEditorWindow(EDITOR_WINDOWS.NAME_PROJECT_WINDOW, activeEditorWindow);
                }
              } />
            <AddProjectFolderButton
              disabled={ !canAddProjectFolder }
              onAddProjectFolder={() => {
                updateActiveEditorWindow(EDITOR_WINDOWS.NAME_PROJECT_FOLDER_WINDOW, activeEditorWindow);
              }} />
            <DeleteFolderButton
              disabled={ !canDeleteFolder }
              onClick={
                () => {
                  if (selectedPackage) {
                    updateActiveEditorWindow(EDITOR_WINDOWS.DELETE_PACKAGE_WINDOW, activeEditorWindow);
                  } else if (selectedFolder) {
                    updateActiveEditorWindow(EDITOR_WINDOWS.DELETE_FOLDER_WINDOW, activeEditorWindow);
                  }
                }
              } />
            <AddFileButton
              onAddFile={() => {
                updateActiveEditorWindow(EDITOR_WINDOWS.NAME_FILE_WINDOW, activeEditorWindow);
              }}
              disabled={ !canAddFile } />
            <DeleteFileButton
              disabled={ !selectedFile?.path }
              onClick={
                (e) => {
                  console.log(selectedFile);
                  updateActiveEditorWindow(EDITOR_WINDOWS.DELETE_FILE_WINDOW, activeEditorWindow);
                }
              } />
            <InstallPackageButton
              onClick={
                () => {
                  setSelectedPackage(null);
                  updateActiveEditorWindow(EDITOR_WINDOWS.INSTALL_PACKAGE_WINDOW, activeEditorWindow)
                }
              }
              />
          </FileMenu>
          <FileBrowser
            files={ fileTree }
            root={ fileTree.path }
            selectedFile={ selectedFile?.path }
            selectedFolder={ selectedFolder }
            selectedPackage={ selectedPackage }
            onFolderRename={() => {
              // updateActiveEditorWindow(EDITOR_WINDOWS.RENAME_FOLDER_WINDOW, activeEditorWindow);
            }}
            onFileRename={() => {
              // updateActiveEditorWindow(EDITOR_WINDOWS.RENAME_FILE_WINDOW, activeEditorWindow);
            }}
            onDeployProject={
              (e) => {
                // TODO: open deploy package window
              }
            }
            onFolderSelect={
              (folder) => {
                // shouldnt deselect anything
                setSelectedFolder(folder);
              }
            }
            onPackageSelect={
              (selectedPackage) => {
                // set selected package,
                // unset selectedFile
                // TODO: make sure 'remote fetch package' window has correct data.

                setSelectedPackage(selectedPackage);
                setSelectedFile(null);

                if (!selectedPackage) {
                  updateActiveEditorWindow(EDITOR_WINDOWS.DEFAULT_WINDOW, activeEditorWindow)
                } else {
                  updateActiveEditorWindow(EDITOR_WINDOWS.INSTALL_PACKAGE_WINDOW, activeEditorWindow)
                }

              }
            }
            onFileSelect={
              async (entry) => {
                const { content } = await onFileSelect(entry);
                setSelectedPackage(null);
                setSelectedFile({
                  ...entry,
                  content
                });
                updateActiveEditorWindow(EDITOR_WINDOWS.CODE_EDITOR_WINDOW, activeEditorWindow);
              }
            } />
        </div>
      </Col>
      <Col className="editor-window-container">
        <EditorMenu
          SaveButton={
            () => (
              <SaveButton
                disabled={ !selectedFile }
                onSave={
                  () => {
                    // NOTE: timeout for ux reasons.
                    setTimeout(() => {
                      onSave(selectedFile)
                    }, 200);
                  }
                } />
            )
          }
        />
        <EditorWindow>
          <DefaultWindow
            fileTree={fileTree}
            active={ activeEditorWindow === EDITOR_WINDOWS.DEFAULT_WINDOW } 
            AddProjectButton={
              () => (
                <AddProjectButton
                  text="create a new project"
                  onAddProject={
                    () => {
                      updateActiveEditorWindow(EDITOR_WINDOWS.NAME_PROJECT_WINDOW, activeEditorWindow);
                    }
                  } />
              )
            }
            InstallPackageButton={
              () => (
                <InstallPackageButton
                  text="install or deploy a remote package" 
                  onClick={
                    () => {
                      setSelectedPackage(null);
                      updateActiveEditorWindow(EDITOR_WINDOWS.INSTALL_PACKAGE_WINDOW, activeEditorWindow)
                    }
                  } />
              )
            } />
          <NameProjectWindow
            active={ activeEditorWindow === EDITOR_WINDOWS.NAME_PROJECT_WINDOW }
            onConfirm={ addProject }
            onCancel={ toDefaultWindow } />
          <NameProjectFolderWindow
            projectName={selectedFolder?.project}
            active={ activeEditorWindow === EDITOR_WINDOWS.NAME_PROJECT_FOLDER_WINDOW }
            onConfirm={ addProjectFolder }
            onCancel={ toDefaultWindow } />
          <NameFileWindow
            active={ activeEditorWindow === EDITOR_WINDOWS.NAME_FILE_WINDOW }
            onConfirm={ addFile }
            onCancel={ toDefaultWindow } />
          {
            /* NOTE: rework how components are rendered, editor needs to
                     have a longer lifespan than other windows */
            activeEditorWindow === EDITOR_WINDOWS.INSTALL_PACKAGE_WINDOW &&
            <PackageInstallWindow
              selectedPackage={ selectedPackage }
              onConfirm={ installPackage }
              onCancel={ toDefaultWindow } 
              deployTargets={ deployTargets }
            />
          }
          <DeletePackageWindow
            active={ activeEditorWindow === EDITOR_WINDOWS.DELETE_PACKAGE_WINDOW } 
            selectedPackage={ selectedPackage }
            onConfirm={
              async () => {

                await onDeletePackage(selectedPackage);

                updateActiveEditorWindow(EDITOR_WINDOWS.DEFAULT_WINDOW, activeEditorWindow);

                setSelectedFile(null);
                setSelectedFolder(null);
                setSelectedPackage(null);

              }
            }
            onCancel={
              () => {
                backToPreviousWindow();
              }
            }

          />
          <DeleteFolderWindow
            active={ activeEditorWindow === EDITOR_WINDOWS.DELETE_FOLDER_WINDOW } 
            selectedFolder={ selectedFolder }
            onConfirm={
              async () => {

                await onDeleteFolder(selectedFolder);

                updateActiveEditorWindow(EDITOR_WINDOWS.DEFAULT_WINDOW, activeEditorWindow);

                setSelectedFile(null);
                setSelectedFolder(null);
                setSelectedPackage(null);

              }
            }
            onCancel={
              () => {
                backToPreviousWindow();
              }
            }
          />
          <DeleteFileWindow
            active={ activeEditorWindow === EDITOR_WINDOWS.DELETE_FILE_WINDOW } 
            selectedFile={ selectedFile }
            onConfirm={
              () => {
                onDeleteFile(selectedFile);
                setSelectedFile(null);
                setSelectedFolder(null);
                updateActiveEditorWindow(EDITOR_WINDOWS.DEFAULT_WINDOW, activeEditorWindow);
              }
            }
            onCancel={
              () => {
                backToPreviousWindow();
              }
            }
          />
          <Editor
            active={ activeEditorWindow === EDITOR_WINDOWS.CODE_EDITOR_WINDOW }
            file={ selectedFile }
            onChange={ updateInMemoryCodeFile } />
        </EditorWindow>
      </Col>
    </Row>
  );
}

export default WebIDE;
