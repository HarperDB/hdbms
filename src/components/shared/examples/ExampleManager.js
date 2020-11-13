import React, { useEffect, useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../functions/state/appState';

import ExampleManagerRow from './ExampleManagerRow';
import ErrorFallback from '../ErrorFallback';

import generateFolderLinks from '../../../functions/examples/generateFolderLinks';
import generateMethodLinks from '../../../functions/examples/generateMethodLinks';
import addError from '../../../functions/api/lms/addError';

const ExampleManager = ({ type }) => {
  const history = useHistory();
  const { customer_id, compute_stack_id, folder, method } = useParams();
  const postmanCollection = useStoreState(appState, (s) => s.postmanCollection);
  const [items, setItems] = useState([]);
  const activeItem = type === 'folder' ? folder : method;
  const baseUrl = customer_id
    ? type === 'folder'
      ? `/o/${customer_id}/i/${compute_stack_id}/examples`
      : `/o/${customer_id}/i/${compute_stack_id}/examples/${folder}`
    : type === 'folder'
    ? `/resources/examples`
    : `/resources/examples/${folder}`;

  useEffect(() => {
    if (postmanCollection) {
      if (type === 'folder') {
        const newItems = generateFolderLinks(postmanCollection);
        setItems(newItems);
        if (!folder) {
          history.push(`${baseUrl}/${newItems[0]}`);
        }
      }
      if (folder && type === 'method') {
        const newItems = generateMethodLinks(postmanCollection, folder);
        setItems(newItems);
        if (!method) {
          history.push(`${baseUrl}/${newItems[0]}`);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postmanCollection, folder]);

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <div className="entity-manager">
        <div className="floating-card-header">{type === 'folder' ? 'category' : 'operations'}</div>
        <Card className="my-3">
          <CardBody className="scrollable">
            {!items.length ? (
              <div className="p-3 text-center">
                <i className="fa-spinner fa fa-spin text-purple" />
              </div>
            ) : (
              items.map((item) => <ExampleManagerRow key={item} item={item} baseUrl={baseUrl} isActive={activeItem === item} />)
            )}
          </CardBody>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default ExampleManager;
