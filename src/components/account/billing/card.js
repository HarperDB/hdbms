import React, { useState } from 'react';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';

import StaticCard from './cardStatic';
import EditCard from './cardEdit';

export default () => {
  const [editingCard, setEditingCard] = useState(false);
  const hasCard = useStoreState(appState, (s) => s.hasCard, [editingCard]);

  return editingCard || !hasCard ? <EditCard setEditingCard={setEditingCard} customerCard={hasCard} /> : <StaticCard setEditingCard={setEditingCard} customerCard={hasCard} />;
};
