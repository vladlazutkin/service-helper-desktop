import React from 'react';
import Tabs from '../../components/tabs/Tabs';
import ColumnView from '../../components/trello/ColumnView';
import MapView from '../../components/trello/MapView';

const Trello = () => {
  return (
    <Tabs
      tabs={[
        {
          label: 'Column View',
          Component: ColumnView,
        },
        {
          label: 'Map View',
          Component: MapView,
        },
      ]}
    />
  );
};

export default Trello;
