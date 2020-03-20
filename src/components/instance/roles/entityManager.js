import React, { useState, useEffect } from 'react';
import { Card, CardBody } from '@nio/ui-kit';

import EntityManagerForm from './entityManagerForm';
import EntityManagerRow from './entityManagerRow';
import EntityManagerHeader from './entityManagerHeader';

export default ({ items, activeItem, showForm, baseUrl, itemType }) => {
  const [isDropping, toggleDropItem] = useState(false);
  const [isCreating, toggleCreate] = useState(false);

  useEffect(() => {
    toggleCreate();
    toggleDropItem();
  }, [activeItem, items]);

  const sortedRoles = items && items.sort((a, b) => (a.role < b.role ? -1 : 1));

  return (
    <div className="db-browser">
      <EntityManagerHeader
        items={items}
        itemType={itemType}
        isDropping={isDropping}
        toggleDropItem={toggleDropItem}
        isCreating={isCreating}
        toggleCreate={toggleCreate}
        showForm={showForm}
      />
      <Card className="mt-3 mb-4">
        <CardBody>
          {sortedRoles && sortedRoles.length ? sortedRoles.map((item) => (
            <EntityManagerRow
              key={item.id}
              item={item}
              baseUrl={baseUrl}
              isActive={activeItem === item.id}
              isDropping={isDropping}
              toggleDropItem={toggleDropItem}
            />
          )) : null}
          {((items && !items.length) || isCreating) && (
            <EntityManagerForm
              items={items}
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
  );
};
