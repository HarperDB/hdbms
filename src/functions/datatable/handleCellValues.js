import React, { useState } from 'react';

import isImage from '../util/isImage';

const TextViewer = ({ value }) => <div className="text-renderer">{value}</div>;

const ImageViewer = ({ src }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  return (
    <div className="image-renderer" onMouseEnter={() => setPreviewOpen(true)} onMouseLeave={() => setPreviewOpen(false)}>
      <i className="fa fa-image" />
      {previewOpen && previewError ? (
        <div className="preview-image no-image">
          <i className="fa fa-ban text-danger" />
          <div className="mt-2">image failed to load</div>
        </div>
      ) : previewOpen ? (
        <img onError={setPreviewError} alt={src} src={src} className="preview-image" />
      ) : null}
    </div>
  );
};

export default (value) => {
  const dataType = Object.prototype.toString.call(value);

  switch (dataType) {
    case '[object Array]':
    case '[object Object]':
      return <TextViewer value={JSON.stringify(value)} />;
    case '[object Boolean]':
      return <TextViewer value={value ? 'true' : 'false'} />;
    case '[object String]':
      return isImage(value) ? <ImageViewer src={value} /> : <TextViewer value={value} />;
    default:
      return <TextViewer value={value} />;
  }
};
