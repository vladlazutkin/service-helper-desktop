import React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import Modal from './Modal';

export interface NotificationSubmitForm {
  title: string;
  body: string | undefined;
  url: string | undefined;
  icon: string | undefined;
}

interface PushNotificationModalProps {
  open: boolean;
  handleClose: () => void;
  handlePushNotification: (data: NotificationSubmitForm) => void;
}

const PushNotificationModal = ({
  open,
  handlePushNotification,
  handleClose,
}: PushNotificationModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NotificationSubmitForm>({
    defaultValues: {
      title: 'Call from klinMotora',
      icon: 'https://shelp.vercel.app/static/media/tapok.6c1918970a29e7ac1200.png',
      url: '/games/call?from=klinMotora',
    },
    resolver: yupResolver(validationSchema),
  });

  return (
    <Modal
      modalProps={{ maxWidth: '800px' }}
      title="Push notification"
      open={open}
      onClose={handleClose}
    >
      <Stack spacing={2}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Title"
          error={!!errors.title}
          helperText={errors.title?.message}
          {...register('title')}
        />
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Body"
          error={!!errors.body}
          helperText={errors.body?.message}
          {...register('body')}
        />
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Icon"
          error={!!errors.icon}
          helperText={errors.icon?.message}
          {...register('icon')}
        />
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Url"
          error={!!errors.url}
          helperText={errors.url?.message}
          {...register('url')}
        />
      </Stack>
      <Stack
        sx={{ mt: '20px' }}
        direction="row"
        spacing={2}
        justifyContent="space-between"
      >
        <Button
          sx={{ minWidth: '80px', color: 'white' }}
          variant="outlined"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ minWidth: '80px', backgroundColor: '#954da4' }}
          onClick={handleSubmit(handlePushNotification)}
        >
          Push
        </Button>
      </Stack>
    </Modal>
  );
};

export default PushNotificationModal;

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  body: yup.string(),
  url: yup.string(),
  icon: yup.string(),
});
