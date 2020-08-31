import React, { useState, useEffect } from 'react';
import { Card, CardBody } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';

import EntityManagerForm from './roleManagerForm';
import EntityManagerRow from './roleManagerRow';
import EntityManagerHeader from './roleManagerHeader';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';

export default ({ items, activeItem, showForm, baseUrl, itemType }) => {
  const { compute_stack_id, customer_id } = useParams();
  const [isDropping, toggleDropItem] = useState(false);
  const [isCreating, toggleCreate] = useState(false);

  useEffect(() => {
    toggleCreate();
    toggleDropItem();
  }, [activeItem, items]);

  const sortedRoles = items && items.sort((a, b) => (a.role < b.role ? -1 : 1));

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <div className="entity-manager">
        <EntityManagerHeader
          items={items}
          itemType={itemType}
          isDropping={isDropping}
          toggleDropItem={toggleDropItem}
          isCreating={isCreating}
          toggleCreate={toggleCreate}
          showForm={showForm}
        />
        <Card className="my-3">
          <CardBody>
            {sortedRoles && sortedRoles.length
              ? sortedRoles.map((item) => (
                  <EntityManagerRow key={item.id} item={item} baseUrl={baseUrl} isActive={activeItem === item.id} isDropping={isDropping} toggleDropItem={toggleDropItem} />
                ))
              : null}
            {((items && !items.length) || isCreating) && (
              <EntityManagerForm
                itemType={itemType}
                baseUrl={baseUrl}
                isDropping={isDropping}
                toggleDropItem={toggleDropItem}
                isCreating={isCreating}
                toggleCreate={toggleCreate}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </ErrorBoundary>
  );
};
