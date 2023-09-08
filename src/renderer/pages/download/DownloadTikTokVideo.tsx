import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import VideoService from '../../services/VideoService';
import { ReactComponent as Logo } from '../../assets/images/vectors/download-file.svg';
import { TikTokDownload } from '../../interfaces';

enum TYPE {
  VIDEO = 'VIDEO',
  IMAGES = 'IMAGES',
}

const DownloadTikTokVideo = () => {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string>(
    'https://www.tiktok.com/@andriy_tsar/video/7240359344083062043'
  );
  const [result, setResult] = useState<
    | { type: TYPE.VIDEO; url: string }
    | { type: TYPE.IMAGES; urls: string[] }
    | null
  >(null);

  const handleDownload = async () => {
    setLoading(true);
    setResult(null);

    VideoService.tikTokDownload<TikTokDownload>({
      link,
    })
      .then((data) => {
        if (data.video) {
          return setResult({ type: TYPE.VIDEO, url: data.video.noWatermark });
        }
        if (data.images?.length) {
          setResult({ type: TYPE.IMAGES, urls: data.images.map((i) => i.url) });
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container>
      <Stack>
        <Stack alignSelf="center" alignItems="center" spacing={3}>
          <Logo width="40vw" style={{ minWidth: '350px', maxWidth: '600px' }} />
          <Typography fontWeight="bold" variant="h5">
            Paste TikTok link here
          </Typography>
          <Stack width="100%" direction="row" spacing={1}>
            <TextField
              disabled={loading}
              fullWidth
              label="TikTok link"
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
          {!!result && result.type === TYPE.VIDEO && (
            <Button
              component={Link}
              href={result.url}
              variant="contained"
              color="primary"
              target="_blank"
            >
              Download
            </Button>
          )}
          {!!result && result.type === TYPE.IMAGES && (
            <Stack spacing={1}>
              {result.urls.map((url, index) => (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography>Image #{index + 1}</Typography>
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
            </Stack>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default DownloadTikTokVideo;
