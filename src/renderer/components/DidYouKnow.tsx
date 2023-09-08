import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Loader from './Loader';
import { useTranslation } from 'react-i18next';

interface DidYouKnowProps {
  fact: {
    body: string;
    imageUrl: string;
  };
}

const DidYouKnow = ({ fact }: DidYouKnowProps) => {
  const { t } = useTranslation();

  return (
    <Stack
      sx={{ height: '100vh' }}
      alignItems="center"
      justifyContent="center"
      spacing={2}
    >
      <Loader />
      <Typography fontWeight="bold" color="#ff7000">
        {t('didYouKnow')}
      </Typography>
      <Typography
        fontWeight="bold"
        textAlign="center"
        sx={{ maxWidth: '300px' }}
      >
        {fact.body}
      </Typography>
    </Stack>
  );
};

export default DidYouKnow;
