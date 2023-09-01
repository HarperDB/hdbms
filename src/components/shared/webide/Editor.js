import React from 'react';
import ReactMonacoEditor from '@monaco-editor/react';

// TODO: update code using whatever monaco hook is available. onupdate.
// don't allow save if there are errors.
function Editor({ active, file, onValidate, onChange }) {

  if (!active)
    return null;

  return (
    <ReactMonacoEditor
      height="100%"
      defaultLanguage="javascript"
      value={file?.content || ''}
      onMount={() => { }}
      onValidate={ onValidate }
      theme="vs-dark" 
      onChange={ onChange }
      options={{
        automaticLayout: true,
        minimap: {
          enabled: false
        }
      }} />
  );
}

export default Editor;
