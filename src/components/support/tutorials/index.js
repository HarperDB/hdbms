import React, { useState } from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { ErrorBoundary } from 'react-error-boundary';

import config from '../../../../config';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';

export default () => {
  const [playlist, setPlaylist] = useState([]);
  const [activeVideo, setActiveVideo] = useState(false);

  useAsyncEffect(async () => {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLlgTMTKsypS5GIn4Yi3NxC4inX_tA5O9I&key=${config.youtube_api_key}`);
      const result = await response.json();
      if (result.items && Array.isArray(result.items)) {
        setPlaylist(result.items);
        setActiveVideo(result.items[0]?.snippet?.resourceId?.videoId);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('error fetching youtube playlist');
    }
  }, []);

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
      <main id="support">
        <span className="floating-card-header mb-3">HarperDB Tutorial Videos</span>
        <Card className="my-3">
          <CardBody>
            <Row>
              <Col lg="8" className="mb-3">
                {activeVideo && (
                  <iframe
                    id="player"
                    title="HarperDB Tutorial Video"
                    width="100%"
                    height="500"
                    src={`https://www.youtube.com/embed/${activeVideo}?modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`}
                    frameBorder="0"
                  />
                )}
              </Col>
              <Col lg="4" className="mb-3">
                <div className="video-scroller">
                  {playlist.map((p) => (
                    <div
                      key={p.id}
                      className={`youtube-thumbnail ${p.snippet.resourceId.videoId === activeVideo ? 'active' : ''}`}
                      style={{
                        backgroundImage: `url('${p.snippet.thumbnails.medium.url}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                      }}
                      onClick={() => setActiveVideo(p.snippet.resourceId.videoId)}
                    >
                      <div className="title">
                        <span>{p.snippet.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </main>
    </ErrorBoundary>
  );
};
