import React, { useState } from 'react';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';

import StaticCard from './cardStatic';
import EditCard from './cardEdit';

export default () => {
  const [editingCard, setEditingCard] = useState(false);
  const hasCard = useStoreState(appState, (s) => s.hasCard, [editingCard]);
  const formStateHeight = '295px';

  return editingCard || !hasCard ? (
    <EditCard formStateHeight={formStateHeight} setEditingCard={setEditingCard} customerCard={hasCard} />
  ) : (
    <StaticCard formStateHeight={formStateHeight} setEditingCard={setEditingCard} customerCard={hasCard} />
  );
};
