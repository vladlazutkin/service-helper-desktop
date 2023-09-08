import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import { useSnackbar } from 'notistack';
import TextField from '@mui/material/TextField';
import Table from '../../components/table/Table';
import {
  HeadCell,
  NotificationSubscription,
  PaginationResponse,
} from '../../interfaces';
import { useDebounce } from '../../helpers/hooks/useDebounce';
import NotificationsService from '../../services/NotificationsService';
import useModal from '../../helpers/hooks/useModal';
import PushNotificationModal, {
  NotificationSubmitForm,
} from '../../components/PushNotificationModal';
import useConfirmModal from '../../helpers/hooks/useConfirmModal';

interface NotificationSubscriptionColumns
  extends Omit<
    NotificationSubscription,
    'keys' | 'expirationTime' | 'endpoint'
  > {}

const headCells: HeadCell<NotificationSubscriptionColumns>[] = [
  {
    id: '_id',
    label: 'Id',
  },
  {
    id: 'email',
    label: 'Email',
  },
];

const Notifications = () => {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [subs, setSubs] = useState<NotificationSubscriptionColumns[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>('');

  const [selected, setSelected] = useState<string>('');

  const [open, handleOpen, handleClose] = useModal();

  const [loadingDelete, setLoadingDelete] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const deferredSearch = useDebounce(search, 1000);
  const { handleConfirm } = useConfirmModal();

  const params = useMemo(() => {
    const searchRowsPerPage = searchParams.get('rows_per_page');
    const searchPage = searchParams.get('page');
    const searchOrderBy = searchParams.get('order_by');
    const rowsPerPage = searchRowsPerPage ? +searchRowsPerPage : 10;
    const page = searchPage ? +searchPage : 0;
    return {
      order: searchParams.get('order') ?? 'asc',
      orderBy: searchOrderBy
        ? searchOrderBy === 'email'
          ? 'user.email'
          : searchOrderBy
        : '_id',
      limit: rowsPerPage.toString(),
      skip: (page * rowsPerPage).toString(),
      search: deferredSearch,
    };
  }, [searchParams, deferredSearch]);

  const handleDelete = async (id: string) => {
    const confirm = await handleConfirm(
      'Are you sure you want to delete this notification?'
    );
    if (!confirm) {
      return;
    }
    setLoadingDelete(true);
    await NotificationsService.remove(id);
    NotificationsService.getList<PaginationResponse<NotificationSubscription>>(
      params
    )
      .then((data) => {
        setSubs(data.data);
        setTotal(data.total);
      })
      .finally(() => {
        enqueueSnackbar('Notification deleted', {
          variant: 'success',
        });
        setLoadingDelete(false);
      });
  };

  const handleDeleteSelected = (ids: string[]) => {
    setLoadingDelete(true);
    setTimeout(() => {
      console.log(ids);
      setLoadingDelete(false);
    }, 2000);
  };

  const handlePushNotification = async (data: NotificationSubmitForm) => {
    NotificationsService.sendToId(selected, data)
      .then(() => {
        enqueueSnackbar('Notifications has been sent', {
          variant: 'success',
        });
      })
      .finally(() => handleClose());
  };

  useEffect(() => {
    setLoading(true);
    NotificationsService.getList<PaginationResponse<NotificationSubscription>>(
      params
    )
      .then((data) => {
        setSubs(data.data);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [params]);

  return (
    <Container>
      <TextField
        placeholder="Search..."
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table
        title="Notifications"
        onDeleteSelected={handleDeleteSelected}
        total={total}
        loadingDelete={loadingDelete}
        onDelete={handleDelete}
        data={subs}
        headCells={headCells}
        loading={loading}
        actions={[
          {
            title: 'Push',
            handler: (id) => {
              setSelected(id);
              handleOpen();
            },
          },
        ]}
        renderCell={(index, object, key) => object[key]}
      />
      <PushNotificationModal
        open={open}
        handleClose={handleClose}
        handlePushNotification={handlePushNotification}
      />
    </Container>
  );
};

export default Notifications;
