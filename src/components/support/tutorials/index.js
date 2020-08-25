import React, { useState } from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';

import config from '../../../config';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';
import EntityManager from './entityManager';

export default () => {
  const history = useHistory();
  const { video_id } = useParams();
  const [items, setItems] = useState([]);
  const baseUrl = '/support/tutorials';
  const activeVideo = video_id && items.find((i) => i.id === video_id);

  useAsyncEffect(async () => {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLlgTMTKsypS5GIn4Yi3NxC4inX_tA5O9I&key=${config.youtube_api_key}`);
      const result = await response.json();

      if (result.items && Array.isArray(result.items)) {
        setItems(result.items);
        if (!activeVideo) {
          const firstVideo = `${baseUrl}/${result.items[0].id}`;
          history.push(firstVideo);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('error fetching youtube playlist');
    }
  }, []);

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
      <Row id="support">
        <Col xl="3" lg="4" md="5" xs="12">
          <EntityManager items={items} baseUrl={baseUrl} videoId={video_id} />
        </Col>
        <Col xl="9" lg="8" md="7" xs="12">
          <span className="floating-card-header mb-3">{activeVideo?.snippet.title}</span>
          <Card className="my-3">
            <CardBody>
              {activeVideo ? (
                <iframe
                  id="player"
                  title="HarperDB Tutorial Video"
                  width="100%"
                  height="500"
                  src={`https://www.youtube.com/embed/${activeVideo.snippet.resourceId.videoId}?modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`}
                  frameBorder="0"
                />
              ) : (
                <div className="py-5 text-center">
                  <i className="fa-spinner fa fa-spin text-purple" />
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </ErrorBoundary>
  );
};
