import React, { useCallback } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';

const CardFrontURL = ({ url }) => {
  const alert = useAlert();
  const canCopyToClipboard = navigator.clipboard;

  const copyURL = useCallback(
    async (e) => {
      e.stopPropagation();
      await navigator.clipboard.writeText(url);
      alert.success('Instance URL copied to clipboard');
    },
    [alert, url]
  );

  return (
    <Row noGutters className="instance-url-holder">
      {canCopyToClipboard && (
        <Col className="copy-icon">
          <Button title="Copy instance url" onClick={copyURL} color="link" disabled={!url}>
            <i className="fa fa-copy text-small" />
          </Button>
        </Col>
      )}
      <Col className="instance-url">{url}</Col>
    </Row>
  );
};

export default CardFrontURL;
