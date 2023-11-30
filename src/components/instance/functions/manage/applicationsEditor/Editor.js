import React, { useState, useEffect } from 'react';
import ReactMonacoEditor from '@monaco-editor/react';

function parseFileExtension(filename) {
  const parts = (filename || '')?.split('.');
  return parts.length > 1 ? parts.slice(-1)[0] : '';
}

const extensionToLanguageMap = {
  js: 'javascript',
  yaml: 'yaml',
  ts: 'typescript',
  json: 'json',
  md: 'markdown',
  html: 'html',
  css: 'css',
  graphql: 'graphql',
};

// TODO: update code using whatever monaco hook is available. onupdate.
// don't allow save if there are errors.
function Editor({ active, file, onFileChange }) {
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    const extension = parseFileExtension(file?.name);
    const updatedLanguage = extensionToLanguageMap[extension] || 'plaintext';
    setLanguage(updatedLanguage);
  }, [file]);

  if (!active) {
    return null;
  }

  // eslint-disable-next-line no-unused-vars
  return (
    <ReactMonacoEditor
      height="100%"
      language={language}
      value={file?.content || ''}
      theme="vs-dark"
      onChange={onFileChange}
      options={{
        readOnly: file?.readOnly,
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
      }}
    />
  );
}

export default Editor;
