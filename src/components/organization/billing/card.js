import React, { useState } from 'react';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';

import StaticCard from './cardStatic';
import EditCard from './cardEdit';

export default () => {
  const [editingCard, setEditingCard] = useState(false);
  const hasCard = useStoreState(appState, (s) => s.hasCard, [editingCard]);
  const formStateHeight = '314px';

  return (
    <div className="mt-3 mb-4">
      {editingCard || !hasCard ? (
        <EditCard formStateHeight={formStateHeight} setEditingCard={setEditingCard} customerCard={hasCard} />
      ) : (
        <StaticCard formStateHeight={formStateHeight} setEditingCard={setEditingCard} customerCard={hasCard} />
      )}
    </div>
  );
};
