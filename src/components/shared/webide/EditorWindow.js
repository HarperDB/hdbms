import React from 'react';
import { Card } from 'reactstrap';

function EditorWindow({ children }) {

  return (
    <Card className="editor-window">{ children }</Card>
  )

}

export default EditorWindow;
