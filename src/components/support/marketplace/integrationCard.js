import React, { useState } from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';
import addIntegrationEngagement from '../../../api/lms/addIntegrationEngagement';
import Code from '../../shared/code';
import appState from '../../../state/appState';
import getIntegrations from '../../../api/lms/getIntegrations';

export default ({ id, avg_rating, user_rating, author_user_id, meta: { name, description, language, homepage, install_command } }) => {
  const auth = useStoreState(appState, (s) => s.auth);
  const alert = useAlert();
  const [sendingRating, setSendingRating] = useState(false);
  const [userRating, setUserRating] = useState(user_rating);
  const canRate = author_user_id !== auth.user_id;

  const addRating = async (rating) => {
    if (rating !== user_rating) {
      setSendingRating(true);
      setUserRating(rating);
      await addIntegrationEngagement({ auth, integration_id: id, rating });
      await getIntegrations({ auth });
      setSendingRating(false);
    }
  };

  const addEngagement = async (type) => {
    addIntegrationEngagement({ auth, integration_id: id, [type]: true });
  };

  return (
    <Col xl="6" xs="12" className="mb-3">
      <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
        <Card className="integration-driver-card">
          <CardBody className="pt-3">
            <b className="d-block">{name}</b>
            <div className="d-block text-truncate">
              <a href={homepage} className="text-small text-darkgrey" target="_blank" rel="noopener noreferrer" onClick={() => addEngagement('go_to_homepage')}>
                {homepage}
              </a>
            </div>
            {['c++', 'c', 'csharp', 'golang', 'kotlin', 'ruby'].includes(language.toLowerCase()) ? (
              <img alt={language.toLowerCase()} title={language.toLowerCase()} className="card-icon" src={`/images/svg/${language.toLowerCase()}.svg`} />
            ) : (
              <i title={language.toLowerCase()} className={`card-icon text-darkgrey fab fa-lg fa-${language.toLowerCase()}`} />
            )}
            {sendingRating ? (
              <div className="my-3 star-rating-container">
                <i className="fa-spinner fa fa-spin text-small text-purple" />
              </div>
            ) : (
              <Row className={`my-3 star-rating-container ${canRate ? 'enabled' : 'disabled'}`}>
                <Col sm="6" className="text-nowrap avg-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      title={star}
                      key={star}
                      onClick={() => alert.error('You cannot rate your own integration')}
                      className={`star-icon text-purple ${
                        !avg_rating || avg_rating < star - 0.5 ? 'far fa-star' : avg_rating === star - 0.5 ? 'fas fa-star-half-alt' : 'fas fa-star'
                      }`}
                    />
                  ))}
                </Col>
                <Col sm="6" className="text-nowrap your-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                    <i
                      key={star}
                      onMouseOver={() => setUserRating(star)}
                      onMouseOut={() => {
                        if (!sendingRating) setUserRating(user_rating);
                      }}
                      onClick={() => {
                        console.log('hi');
                        addRating(star);
                      }}
                      className={`star-icon text-purple ${
                        !userRating || userRating < star - 0.5 ? 'far fa-star' : userRating === star - 0.5 ? 'fas fa-star-half-alt' : 'fas fa-star'
                      }`}
                    />
                  ))}
                </Col>
              </Row>
            )}
            {install_command ? (
              <Code onClick={() => addEngagement('copy_install_command')}>{install_command}</Code>
            ) : (
              <div className="code-holder">
                <pre className="lolight">Please visit homepage for usage</pre>
              </div>
            )}
            <div className="marketplace-description">{description}</div>
          </CardBody>
        </Card>
      </ErrorBoundary>
    </Col>
  );
};
