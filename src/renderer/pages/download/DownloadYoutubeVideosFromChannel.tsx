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
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { isValidUrl } from '../../helpers/isValidUrl';

const DownloadYoutubeVideosFromChannel = () => {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string>(
    'https://www.youtube.com/watch?v=Qmezd5yTGRQ&list=PLeNA_n0ilI4lQMzsqyDgGCMBxJ34GaMJZ&ab_channel=SWEEQTY'
  );
  const [audioOnly, setAudioOnly] = useState<boolean>(true);
  const [result, setResult] = useState<string[]>([]);

  const handleDownload = async () => {
    setLoading(true);
    setResult([]);

    const playlistId = isValidUrl(link)
      ? new URL(link).searchParams.get('list') ?? link
      : link;
    VideoService.youtubeDownloadFromPlaylist<{ urls: string[] }>({
      audioOnly,
      playlistId,
    })
      .then((data) => setResult(data.urls))
      .finally(() => setLoading(false));
  };

  const handleDownloadAll = () => {
    result.forEach((url) =>
      window.open(url, '_blank', 'width:640px;height:640px')
    );
  };

  return (
    <Container>
      <Stack>
        <Stack alignSelf="center" alignItems="center" spacing={3}>
          <Logo width="40vw" style={{ minWidth: '350px', maxWidth: '600px' }} />
          <Typography textAlign="center" fontWeight="bold" variant="h5">
            Paste YouTube playlist link or id here
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
          <FormControlLabel
            control={
              <Checkbox
                color="error"
                checked={audioOnly}
                onChange={() => setAudioOnly(!audioOnly)}
              />
            }
            label="Audio only"
          />
          {!!result.length && (
            <Stack spacing={1}>
              {result.map((url, index) => (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography>
                    {audioOnly ? 'Audio' : 'Video'} #{index + 1}
                  </Typography>
                  <Button
                    component={Link}
                    href={url}
                    variant="contained"
                    color="primary"
                    target="_blank"
                  >
                    Download
                  </Button>
                </Stack>
              ))}
              <Button
                onClick={handleDownloadAll}
                variant="contained"
                color="primary"
              >
                Download all
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default DownloadYoutubeVideosFromChannel;
