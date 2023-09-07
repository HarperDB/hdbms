import React from 'react';
import ReactMonacoEditor from '@monaco-editor/react';

// TODO: update code using whatever monaco hook is available. onupdate.
// don't allow save if there are errors.
function Editor({ active, file, onChange }) {

  // eslint-disable-next-line no-unused-vars
  const [ componentsDir, ...relativePathSegments] = file.path.split('/');
  const relativePath = relativePathSegments.join('/');

  return <>
      <div className="editor current-file-path">{ relativePath }</div>
      <ReactMonacoEditor
        height="100%"
        defaultLanguage="javascript"
        value={file?.content || ''}
        theme="vs-dark" 
        onMount={
          () => {
            console.log('on mount');
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
