import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import Editor from '@monaco-editor/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

// TODO: update code using whatever monaco hook is available. onupdate.
// don't allow save if there are errors.
function EditorWindow({ fileInfo, onChange }) {

  return (
    <Card style={{height: '100%'}}>
      <Row>edit &gt; { fileInfo.path }</Row>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={fileInfo.content}
        onMount={() => { console.log('editor mounted') }}
        theme="vs-dark" 
        onChange={onChange}
        options={{
          minimap: {
            enabled: false
          }
        }} />
    </Card>
  );
}

export default EditorWindow;
