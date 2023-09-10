import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material';
import DesktopFileService from '../services/DesktopFileService';
import { DesktopFile } from '../interfaces';
import { useSnackbar } from 'notistack';
import { socket, useSocket } from '../context/socket.context';

const DesktopManagement = () => {
  const [files, setFiles] = useState<DesktopFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const socket = useSocket();

  const onSelectFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];

    await DesktopFileService.create({ name: file.name, path: file.path });

    DesktopFileService.getList<DesktopFile[]>().then((data) => {
      setFiles(data);
      setLoadingDelete(false);
    });
  };

  const handleRemove = async (id: string) => {
    setLoadingDelete(true);
    await DesktopFileService.remove(id);

    DesktopFileService.getList<DesktopFile[]>().then((data) => {
      setFiles(data);
      setLoadingDelete(false);
    });
  };

  const handleOpen = (path: string) => {
    window.electron
      .openApp(path)
      .then(() => {
        socket.emit('exec-success', { message: 'File opened' });
      })
      .catch((e) => {
        socket.emit('exec-error', { message: 'Error opening file' });
        enqueueSnackbar('Error opening file', { variant: 'error' });
      });
  };

  useEffect(() => {
    setLoading(true);
    DesktopFileService.getList<DesktopFile[]>()
      .then((data) => setFiles(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container sx={{ pt: 1 }}>
      <Button sx={{ height: '58px' }} variant="contained" component="label">
        {t('pages.profile.uploadFile')}
        <input type="file" hidden onChange={onSelectFile} />
      </Button>
      <Stack spacing={2} sx={{ mt: 2 }}>
        {files.map((file, index) => (
          <Card
            sx={{ backgroundColor: theme.palette.secondary.main }}
            key={file._id}
          >
            <CardContent>
              <Stack spacing={1}>
                <Stack
                  justifyContent="space-between"
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <Typography>{file.name}</Typography>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <LoadingButton
                      variant="contained"
                      loading={loadingDelete}
                      onClick={() => handleOpen(file.path)}
                    >
                      Open
                    </LoadingButton>
                    <LoadingButton
                      loading={loadingDelete}
                      variant="contained"
                      color="error"
                      onClick={() => handleRemove(file._id)}
                    >
                      Delete
                    </LoadingButton>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
            {index !== files.length - 1 && <Divider />}
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default DesktopManagement;
