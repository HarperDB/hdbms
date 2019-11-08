import React, { useState } from 'react';

import isImage from './isImage';

const TextViewer = ({ value }) => (<div className="text-renderer">{value}</div>);

const ImageViewer = ({ src }) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className="image-renderer" onMouseEnter={() => setPreviewOpen(true)} onMouseLeave={() => setPreviewOpen(false)}>
      <i className="fa fa-image" />
      {previewOpen && (<img alt={src} src={src} className="preview-image" />)}
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
      return <TextViewer value={value ? 'True' : 'False'} />;
    case '[object String]':
      return isImage(value) ? <ImageViewer src={value} /> : <TextViewer value={value} />;
    default:
      return <TextViewer value={value} />;
  }
};
