import React from 'react';
import Tabs from '../../components/tabs/Tabs';
import StartScreen from './StartScreen';
import Notifications from './Notifications';
import General from './General';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation();

  return (
    <Tabs
      tabs={[
        {
          label: t('pages.settings.tabs.general.title'),
          Component: General,
        },
        {
          label: t('pages.settings.tabs.startScreen.title'),
          Component: StartScreen,
        },
        {
          label: t('pages.settings.tabs.notifications.title'),
          Component: Notifications,
        },
      ]}
    />
  );
};

export default Settings;
