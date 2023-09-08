import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { RoutesPath } from '../../constants/route-paths';
import React, { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import AuthService from '../../services/AuthService';
import {
  CredentialResponse,
  GoogleLogin,
  useGoogleOneTapLogin,
} from '@react-oauth/google';
import GoogleService from '../../services/GoogleService';
import { useToken } from '../../context/token.context';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';

interface LoginSubmitForm {
  email: string;
  password: string;
}

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { updateToken } = useToken();

  const handleGoogleLogin = async (data: CredentialResponse) => {
    setLoading(true);
    GoogleService.login<{ token: string }>(data).then((data) => {
      updateToken(data.token);
      setLoading(false);
    });
  };

  useGoogleOneTapLogin({
    onSuccess: handleGoogleLogin,
    onError: () => {
      console.log('Login Failed');
    },
  });

  const onSubmit = async (form: LoginSubmitForm) => {
    setLoading(true);
    AuthService.register<{ message: string }>(form)
      .then((data) => {
        const key: string | number = enqueueSnackbar(
          data?.message || 'success',
          {
            variant: 'success',
            SnackbarProps: {
              onClick: () => closeSnackbar(key),
            },
            onClose: () => {
              navigate(RoutesPath.LOGIN);
            },
          }
        );
      })
      .catch((e) => {
        enqueueSnackbar(e.response?.data?.message || 'error', {
          variant: 'error',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          pt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1 }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t('pages.register.registerTitle')}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            label={t('pages.register.email')}
            {...register('email')}
          />
          <TextField
            margin="normal"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
            label={t('pages.register.password')}
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
          />
          <LoadingButton
            loading={loading}
            type="submit"
            fullWidth
            color="info"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {t('pages.register.registerTitle')}
          </LoadingButton>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            sx={{ my: 2 }}
          >
            <GoogleLogin
              theme="filled_black"
              onSuccess={handleGoogleLogin}
              shape="circle"
            />
          </Stack>
          <Grid container>
            <Grid item xs>
              <Link color="#b7b7b7" href="#" variant="body1">
                {t('pages.register.forgotPassword')}
              </Link>
            </Grid>
            <Grid item>
              <Link color="#b7b7b7" href={RoutesPath.LOGIN} variant="body1">
                {t('pages.register.haveAnAccount')}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

const validationSchema = yup.object({
  email: yup.string().required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default Register;
