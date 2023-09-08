import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { RoutesPath } from '../../constants/route-paths';
import { useToken } from '../../context/token.context';
import React, { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import AuthService from '../../services/AuthService';
import { useSnackbar } from 'notistack';
import {
  useGoogleOneTapLogin,
  GoogleLogin,
  CredentialResponse,
} from '@react-oauth/google';
import GoogleService from '../../services/GoogleService';
import Stack from '@mui/material/Stack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';

interface LoginSubmitForm {
  email: string;
  password: string;
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { updateToken } = useToken();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { t } = useTranslation();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (form: LoginSubmitForm) => {
    setLoading(true);
    AuthService.login<{ token: string }>(form)
      .then((data) => {
        if (data.token) {
          updateToken(data.token);
        }
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
          {t('pages.login.loginTitle')}
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
            label={t('pages.login.email')}
            {...register('email')}
          />
          <TextField
            margin="normal"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
            label={t('pages.login.email')}
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
            {t('pages.login.loginTitle')}
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
              <Link color="#b7b7b7" href={RoutesPath.REGISTER} variant="body1">
                {t('pages.login.dontHaveAnAccount')}
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

export default Login;
