import React from 'react';
import { Card } from 'reactstrap';

export const EDITOR_WINDOWS = {
  DEFAULT: 'CODE_EDITOR',
  BLANK_WINDOW: 'BLANK_WINDOW',
  CODE_EDITOR: 'CODE_EDITOR',
  NAME_FILE: 'NAME_FILE',
  NAME_FOLDER: 'NAME_FOLDER',
  RENAME_FILE: 'RENAME_FILE',
  RENAME_FOLDER: 'RENAME_FOLDER',
  NO_FILE_SELECTED: 'NO_FILE_SELECTED',
  DEPLOY: 'DEPLOY'
};

function EditorWindow({ activeWindow, BlankWindow, CodeEditor, NameFile, NameFolder, RenameFile, RenameFolder, DeployWindow, NoFileSelected }) {

  let CurrentWindow = null;

  if (activeWindow === EDITOR_WINDOWS.BLANK_WINDOW) {
    CurrentWindow = BlankWindow;
  } else if (activeWindow === EDITOR_WINDOWS.CODE_EDITOR) {
    CurrentWindow = CodeEditor;
  } else if (activeWindow === EDITOR_WINDOWS.FILENAME_DIALOG) {
    CurrentWindow = RenameFile;
  } else if (activeWindow === EDITOR_WINDOWS.RENAME_FILE) {
    CurrentWindow = RenameFile;
  } else if (activeWindow === EDITOR_WINDOWS.RENAME_FOLDER) {
    CurrentWindow = RenameFolder;
  } else if (activeWindow === EDITOR_WINDOWS.NAME_FILE) {
    CurrentWindow = NameFile;
  } else if (activeWindow === EDITOR_WINDOWS.NAME_FOLDER) {
    CurrentWindow = NameFolder;
  } else if (activeWindow === EDITOR_WINDOWS.NO_FILE_SELECTED) {
    CurrentWindow = NoFileSelected;
  } else if (activeWindow === EDITOR_WINDOWS.DEPLOY) {
    CurrentWindow = DeployWindow;
  }

  return (
    <Card className="editor-window">
    { <CurrentWindow /> }
    </Card>
  )

}



export default EditorWindow;
