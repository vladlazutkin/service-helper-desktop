import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import NotificationsService from '../../services/NotificationsService';
import { urlBase64ToUint8Array } from '../../helpers/urlBase64ToUint8Array';
import { NotificationSubscription } from '../../interfaces';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';

const Notifications = () => {
  const [subscription, setSubscription] =
    useState<NotificationSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSub, setLoadingSub] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const subscribe = async () => {
    if (!('serviceWorker' in navigator)) {
      return;
    }
    setLoadingSub(true);

    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    await NotificationsService.create(subscription);
    await NotificationsService.getMySubscription<NotificationSubscription>().then(
      (data) => {
        setSubscription(data);
      }
    );

    enqueueSnackbar('Successfully subscribed to notifications', {
      variant: 'success',
    });
    setLoadingSub(false);
  };

  const unsubscribe = async () => {
    setLoadingSub(true);

    await NotificationsService.remove(subscription!._id);
    await NotificationsService.getMySubscription<NotificationSubscription>().then(
      (data) => {
        setSubscription(data);
      }
    );

    enqueueSnackbar('Successfully unsubscribed from notifications', {
      variant: 'success',
    });
    setLoadingSub(false);
  };

  useEffect(() => {
    NotificationsService.getMySubscription<NotificationSubscription>()
      .then((data) => {
        setSubscription(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container>
        <InputLabel>Notifications</InputLabel>
        <Button disabled variant="contained">
          loading...
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <InputLabel>Notifications</InputLabel>
      {!subscription ? (
        <LoadingButton
          loading={loadingSub}
          variant="contained"
          color="info"
          onClick={subscribe}
        >
          {t('pages.settings.tabs.notifications.subscribe')}
        </LoadingButton>
      ) : (
        <LoadingButton
          loading={loadingSub}
          variant="contained"
          onClick={unsubscribe}
        >
          {t('pages.settings.tabs.notifications.unsubscribe')}
        </LoadingButton>
      )}
    </Container>
  );
};

export default Notifications;

const publicVapidKey =
  'BFxefyAh-0sgU-1bx5F4E8eO82k9GoRwr4yYtBTrG6Dq2dFGMiNwEvQc0nBor09sMvuaDT-52fWf9EzOC7D45P8';
