import React, { useState, useEffect, useRef } from 'react';
import ReactMonacoEditor from '@monaco-editor/react';

function parseFileExtension(filename) {
  return filename?.split('.').slice(-1)[0]; 
}

const extensionToLanguageMap = {
  js: 'javascript',
  yaml: 'null',
  ts: 'typescript',
  json: 'json',
  null: 'javascript',
  undefined: 'javascript'
};

// TODO: update code using whatever monaco hook is available. onupdate.
// don't allow save if there are errors.
function Editor({ active, file, onChange }) {

  const [ language, setLanguage ] = useState('javascript');
  const editorRef = useRef(null);

  useEffect(() => {
    const extension = parseFileExtension(file?.name);
    const language = extensionToLanguageMap[extension];
    setLanguage(language);
  }, [file]);


  if (!active) {
    return null;
  }

  const filepathRelativeToComponentsDir = file.path.split('/').slice(1).join('/');
  // eslint-disable-next-line no-unused-vars
  return <>
      <div className="editor current-file-path">{filepathRelativeToComponentsDir}</div>
      <ReactMonacoEditor
        height="100%"
        language={language}
        value={file?.content || ''}
        theme="vs-dark" 
        onMount={
          (editor, monaco) => {
            editorRef.current = editor
            console.info('on mount: ', { currentRef: editorRef.current, editor });
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
