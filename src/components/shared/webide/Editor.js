import React from 'react';
import ReactMonacoEditor from '@monaco-editor/react';

// TODO: update code using whatever monaco hook is available. onupdate.
// don't allow save if there are errors.
function Editor({ active, file, onChange }) {

  if (!active) {
    return null;
  }

  const filePathRelativeToComponentsDir = file.path.split('/').slice(1).join('/');
  // eslint-disable-next-line no-unused-vars
  return <>
      <div className="editor current-file-path">?</div>
      <ReactMonacoEditor
        height="100%"
        defaultLanguage="javascript"
        value={file?.content || ''}
        theme="vs-dark" 
        onMount={
          () => {
            console.info('on mount');
          }
        }
        onChange={ onChange }
        options={{
          automaticLayout: true,
          minimap: {
            enabled: false
          }
        }} />
  </>
}

export default Editor;
