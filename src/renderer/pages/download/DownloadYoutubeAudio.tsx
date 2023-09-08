import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import VideoService from '../../services/VideoService';
import { ReactComponent as Logo } from '../../assets/images/vectors/download-file.svg';

const DownloadYoutubeAudio = () => {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string>(
    'https://www.youtube.com/watch?v=U9svKUcAZdw&t=169s&ab_channel=PatrickMusic'
  );
  const [result, setResult] = useState('');

  const handleDownload = async () => {
    setLoading(true);
    setResult('');

    VideoService.youtubeDownloadAudio<{ url: string }>({ link })
      .then((data) => setResult(data.url))
      .finally(() => setLoading(false));
  };

  return (
    <Container>
      <Stack>
        <Stack alignSelf="center" alignItems="center" spacing={3}>
          <Logo width="40vw" style={{ minWidth: '350px', maxWidth: '600px' }} />
          <Typography fontWeight="bold" variant="h5">
            Paste YouTube link here
          </Typography>
          <Stack width="100%" direction="row" spacing={1}>
            <TextField
              disabled={loading}
              fullWidth
              label="YouTube link"
              variant="filled"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <LoadingButton
              disabled={!link}
              loading={loading}
              variant="contained"
              component="label"
              onClick={handleDownload}
            >
              Begin
            </LoadingButton>
          </Stack>
          {!!result && (
            <Button
              component={Link}
              href={result}
              variant="contained"
              color="primary"
              target="_blank"
            >
              Download
            </Button>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default DownloadYoutubeAudio;
