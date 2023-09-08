import React from 'react';
import Tabs from '../../components/tabs/Tabs';
import Users from './Users';
import Notifications from './Notifications';

const AdminPanel = () => {
  return (
    <Tabs
      tabs={[
        {
          label: 'Users',
          Component: Users,
        },
        {
          label: 'Notifications',
          Component: Notifications,
        },
      ]}
    />
  );
};

export default AdminPanel;
