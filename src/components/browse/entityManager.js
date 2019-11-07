import React, { useState, useEffect } from 'react';
import { Card, CardBody } from '@nio/ui-kit';

import EntityManagerForm from './entityManagerForm';
import EntityManagerRow from './entityManagerRow';
import EntityManagerHeader from './entityManagerHeader';

export default ({ items, activeItem, activeSchema = false, update }) => {
  const [isDropping, toggleDropItem] = useState(false);
  const [isCreating, toggleCreate] = useState(false);

  const baseUrl = activeSchema ? `/browse/${activeSchema}` : '/browse';
  const itemType = activeSchema ? 'table' : 'schema';

  useEffect(() => {
    toggleCreate();
    toggleDropItem();
  }, [activeItem, activeSchema, items]);

  return (
    <div className="db-browser">
      <EntityManagerHeader
        items={items}
        itemType={itemType}
        isDropping={isDropping}
        toggleDropItem={toggleDropItem}
        isCreating={isCreating}
        toggleCreate={toggleCreate}
      />
      <Card className="mb-3 mt-2">
        <CardBody>
          {items && items.length ? items.sort().map((item) => (
            <EntityManagerRow
              key={item}
              item={item}
              itemType={itemType}
              baseUrl={baseUrl}
              isActive={activeItem === item}
              isDropping={isDropping}
              toggleDropItem={toggleDropItem}
              activeSchema={activeSchema}
              update={update}
            />
          )) : (
            null
          )}
          {((items && !items.length) || isCreating) && (
            <EntityManagerForm
              items={items}
              itemType={itemType}
              baseUrl={baseUrl}
              activeSchema={activeSchema}
              isDropping={isDropping}
              toggleDropItem={toggleDropItem}
              isCreating={isCreating}
              toggleCreate={toggleCreate}
              update={update}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};
