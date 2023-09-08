import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import {
  HeadCell,
  PaginationResponse,
  User,
  USER_ROLE,
} from '../../interfaces';
import UserService from '../../services/UserService';
import Table from '../../components/table/Table';
import Checkbox from '@mui/material/Checkbox';
import { useSnackbar } from 'notistack';
import { useUser } from '../../context/user.context';
import TextField from '@mui/material/TextField';
import { useDebounce } from '../../helpers/hooks/useDebounce';
import useConfirmModal from '../../helpers/hooks/useConfirmModal';

const headCells: HeadCell<User>[] = [
  {
    id: '_id',
    label: 'Id',
  },
  {
    id: 'email',
    label: 'Email',
  },
  {
    id: 'hasSpotifyAccess',
    label: 'Has Spotify access token',
  },
  {
    id: 'role',
    label: 'Admin',
  },
];

const Users = () => {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>('');

  const [loadingDelete, setLoadingDelete] = useState(false);

  const { user } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const { handleConfirm } = useConfirmModal();
  const deferredSearch = useDebounce(search, 1000);

  const params = useMemo(() => {
    const searchRowsPerPage = searchParams.get('rows_per_page');
    const searchPage = searchParams.get('page');
    const searchOrderBy = searchParams.get('order_by');
    const rowsPerPage = searchRowsPerPage ? +searchRowsPerPage : 10;
    const page = searchPage ? +searchPage : 0;
    return {
      order: searchParams.get('order') ?? 'asc',
      orderBy: searchOrderBy
        ? searchOrderBy === 'hasSpotifyAccess'
          ? 'spotifyAccessToken'
          : searchOrderBy
        : '_id',
      limit: rowsPerPage.toString(),
      skip: (page * rowsPerPage).toString(),
      search: deferredSearch,
    };
  }, [searchParams, deferredSearch]);

  const handleDelete = async (id: string) => {
    if (user?._id === id) {
      return enqueueSnackbar("You can't delete yourself", {
        variant: 'error',
      });
    }
    const confirm = await handleConfirm(
      'Are you sure you want to delete this user and all related data?'
    );
    if (!confirm) {
      return;
    }
    setLoadingDelete(true);
    await UserService.delete(id, ['all']);
    UserService.getList<PaginationResponse<User>>(params)
      .then((data) => {
        setUsers(data.data);
        setTotal(data.total);
      })
      .finally(() => {
        enqueueSnackbar('User deleted', {
          variant: 'success',
        });
        setLoadingDelete(false);
      });
  };

  const handleDeleteSelected = (ids: string[]) => {
    if (user?._id && ids.includes(user?._id)) {
      return enqueueSnackbar("You can't delete yourself", {
        variant: 'error',
      });
    }
    setLoadingDelete(true);
    setTimeout(() => {
      console.log(ids);
      setLoadingDelete(false);
    }, 2000);
  };

  const handleSwitchUserToAdmin = async (id: string) => {
    if (user?._id === id) {
      return enqueueSnackbar("You can't edit yourself", {
        variant: 'error',
      });
    }

    await UserService.switchToAdmin(id);
    UserService.getList<PaginationResponse<User>>(params)
      .then((data) => {
        setUsers(data.data);
        setTotal(data.total);
      })
      .finally(() => {
        enqueueSnackbar('User updated', {
          variant: 'success',
        });
      });
  };

  useEffect(() => {
    setLoading(true);
    UserService.getList<PaginationResponse<User>>(params)
      .then((data) => {
        setUsers(data.data);
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
        title="Users"
        onDeleteSelected={handleDeleteSelected}
        total={total}
        loadingDelete={loadingDelete}
        onDelete={handleDelete}
        data={users}
        headCells={headCells}
        loading={loading}
        renderCell={(index, object, key) => {
          if (key === 'hasSpotifyAccess') {
            return object[key] ? 'Spotify connected' : 'Spotify not connected';
          }
          if (key === 'role') {
            return (
              <Checkbox
                color="secondary"
                checked={object[key] === USER_ROLE.ADMIN}
                onChange={() => handleSwitchUserToAdmin(object._id)}
              />
            );
          }
          return object[key];
        }}
      />
    </Container>
  );
};

export default Users;
