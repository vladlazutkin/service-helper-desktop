import React, { ChangeEvent, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import UserService from '../services/UserService';
import { getImg } from '../helpers/getImg';
import { useUser } from '../context/user.context';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';

interface EmailSubmitForm {
  email: string;
}

interface PasswordSubmitForm {
  current: string | undefined;
  new: string;
  repeat: string;
}

const Profile = () => {
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingProfileImg, setLoadingProfileImg] = useState(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [selectedFile, setSelectedFile] = useState<File>();
  const [image, setImage] = useState('');

  const { user, updateUser } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
    setValue: setEmailValue,
  } = useForm<EmailSubmitForm>({
    resolver: yupResolver(emailValidationSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordSubmitForm>({
    resolver: yupResolver(passwordValidationSchema),
  });

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return setSelectedFile(undefined);
    }
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
  };

  const handleUpdateEmail = async (data: EmailSubmitForm) => {
    setLoadingEmail(true);
    await UserService.updateEmail(data)
      .then(() => {
        enqueueSnackbar('Email has been updated', {
          variant: 'success',
        });
      })
      .finally(() => {
        setLoadingEmail(false);
        updateUser({ ...user!, email: data.email });
      });
  };

  const handleUpdatePassword = async (data: PasswordSubmitForm) => {
    setLoadingPassword(true);
    await UserService.updatePassword(data)
      .then(() => {
        enqueueSnackbar('Password has been changed', {
          variant: 'success',
        });
      })
      .catch((e) => {
        enqueueSnackbar(e.response?.data?.message || 'error', {
          variant: 'error',
        });
      })
      .finally(() => setLoadingPassword(false));
  };

  const handleUpdateProfileImg = async () => {
    setLoadingProfileImg(true);
    const formData = new FormData();
    formData.append('file', selectedFile!);
    await UserService.updateProfileIcon<{ profileIcon: string }>(formData)
      .then((data) => {
        updateUser({ ...user!, profileIcon: data.profileIcon });
        enqueueSnackbar('Icon has been updated', {
          variant: 'success',
        });
      })
      .finally(() => setLoadingProfileImg(false));
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    if (user.profileIcon) {
      setImage(getImg(user.profileIcon));
    }
    setEmailValue('email', user.email);
  }, [user]);
  const loading = !user;

  if (loading) {
    return (
      <Container>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <Stack
            sx={{ flex: 1, minWidth: '300px' }}
            spacing={2}
            direction="column"
            alignItems="flex-start"
          >
            <InputLabel>{t('pages.profile.email')}</InputLabel>
            <Skeleton variant="rounded" height={60} width="100%" />
            <Skeleton variant="rounded" height={40} width={135} />
            <InputLabel>{t('pages.profile.password')}</InputLabel>
            <Skeleton variant="rounded" height={57} width="100%" />
            <Skeleton variant="rounded" height={57} width="100%" />
            <Skeleton variant="rounded" height={57} width="100%" />
            <Skeleton variant="rounded" height={40} width={165} />
          </Stack>
          <Stack
            sx={{ flex: 1, minWidth: '300px' }}
            spacing={2}
            alignItems="flex-start"
          >
            <InputLabel>{t('pages.profile.profileImage')}</InputLabel>
            <Skeleton variant="rounded" height={58} width={120} />
            <Skeleton variant="rounded" height={300} width="100%" />
          </Stack>
        </Stack>
      </Container>
    );
  }

  return (
    <Container>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <Stack
          sx={{ flex: 1, minWidth: '300px' }}
          spacing={2}
          direction="column"
          alignItems="flex-start"
        >
          <InputLabel sx={{ textTransform: 'uppercase' }}>
            {t('pages.profile.email')}
          </InputLabel>
          <TextField
            variant="filled"
            fullWidth
            error={!!emailErrors.email}
            helperText={emailErrors.email?.message}
            {...registerEmail('email')}
          />
          <LoadingButton
            loading={loadingEmail}
            variant="contained"
            onClick={handleSubmitEmail(handleUpdateEmail)}
          >
            {t('pages.profile.updateEmail')}
          </LoadingButton>
          <InputLabel sx={{ textTransform: 'uppercase' }}>
            {t('pages.profile.password')}
          </InputLabel>
          <TextField
            label={t('pages.profile.currentPassword')}
            variant="filled"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              sx: { pr: 0 },
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="start"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...registerPassword('current')}
            error={!!passwordErrors.current}
            helperText={passwordErrors.current?.message}
          />
          <TextField
            label={t('pages.profile.newPassword')}
            variant="filled"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              sx: { pr: 0 },
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="start"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...registerPassword('new')}
            error={!!passwordErrors.new}
            helperText={passwordErrors.new?.message}
          />
          <TextField
            label={t('pages.profile.repeatPassword')}
            variant="filled"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              sx: { pr: 0 },
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="start"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...registerPassword('repeat')}
            error={!!passwordErrors.repeat}
            helperText={passwordErrors.repeat?.message}
          />
          <LoadingButton
            loading={loadingPassword}
            variant="contained"
            onClick={handleSubmitPassword(handleUpdatePassword)}
          >
            {t('pages.profile.updatePassword')}
          </LoadingButton>
        </Stack>
        <Stack
          sx={{ flex: 1, minWidth: '300px' }}
          spacing={2}
          alignItems="flex-start"
        >
          <InputLabel sx={{ textTransform: 'uppercase' }}>
            {t('pages.profile.profileImage')}
          </InputLabel>
          <Button sx={{ height: '58px' }} variant="contained" component="label">
            {t('pages.profile.uploadFile')}
            <input type="file" hidden onChange={onSelectFile} />
          </Button>
          {!!image && <img width="100%" src={image} alt="profile image" />}
          {!!image && !!selectedFile && (
            <LoadingButton
              loading={loadingProfileImg}
              variant="contained"
              onClick={handleUpdateProfileImg}
            >
              {t('pages.profile.updateProfileIcon')}
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

const emailValidationSchema = yup.object({
  email: yup.string().email().required('Email is required'),
});

const passwordValidationSchema = yup.object({
  current: yup.string(),
  new: yup.string().required('New password is required'),
  repeat: yup
    .string()
    .required('Repeat password is required')
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.new === value;
    }),
});

export default Profile;
