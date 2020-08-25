import React, { useState, useEffect } from 'react';
import { Card, CardBody } from 'reactstrap';

import EntityManagerForm from './entityManagerForm';
import EntityManagerRow from './entityManagerRow';
import EntityManagerHeader from './entityManagerHeader';

const EntityManager = ({ items, activeItem, activeSchema = false, showForm, baseUrl, itemType }) => {
  const [isDropping, toggleDropItem] = useState(false);
  const [isCreating, toggleCreate] = useState(false);

  useEffect(() => {
    toggleCreate();
    toggleDropItem();
  }, [activeItem, activeSchema, items]);

  return (
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
          {items && items.length
            ? items.map((item) => (
                <EntityManagerRow
                  key={item}
                  item={item}
                  itemType={itemType}
                  baseUrl={baseUrl}
                  isActive={activeItem === item}
                  isDropping={isDropping}
                  toggleDropItem={toggleDropItem}
                  activeSchema={activeSchema}
                />
              ))
            : null}
          {((items && !items.length) || isCreating) && showForm ? (
            <EntityManagerForm
              items={items}
              itemType={itemType}
              baseUrl={baseUrl}
              activeSchema={activeSchema}
              isDropping={isDropping}
              toggleDropItem={toggleDropItem}
              isCreating={isCreating}
              toggleCreate={toggleCreate}
            />
          ) : items && !items.length && !showForm ? (
            <div className="py-3 text-center no-content">no visible schemas or tables</div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
};

export default EntityManager;
