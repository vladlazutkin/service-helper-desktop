import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Loader from './Loader';
import { useTranslation } from 'react-i18next';

interface IrregularVerbsTimeProps {
  verb: {
    words: string[];
    translate: string;
  };
}

const IrregularVerbsTime = ({ verb }: IrregularVerbsTimeProps) => {
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
        {t('irregularVerbsTime')}
      </Typography>
      <Typography
        fontWeight="bold"
        textAlign="center"
        sx={{ maxWidth: '300px' }}
      >
        {verb.words.join(' - ')}
      </Typography>
      <Typography
        fontWeight="bold"
        textAlign="center"
        sx={{ maxWidth: '300px' }}
      >
        {verb.translate}
      </Typography>
    </Stack>
  );
};

export default IrregularVerbsTime;
