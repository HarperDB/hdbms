import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import Editor from '@monaco-editor/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

function EditorWindow({ code }) {

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      value={code}
      onMount={() => { console.log('editor mounted') }}
      theme="vs-dark" />
  );
}

export default EditorWindow;
