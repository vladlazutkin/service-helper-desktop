import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { ReactComponent as Logo } from '../../assets/images/vectors/download-file.svg';

const DownloadImageFromClipboard = () => {
  const [image, setImage] = useState('');
  const [type, setType] = useState<string>('');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `image.${type}`;
    link.href = image;
    link.click();
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();

      for (const clipboardItem of Array.from(e.clipboardData?.files ?? [])) {
        if (clipboardItem.type.startsWith('image/')) {
          setType(
            clipboardItem.type.slice(clipboardItem.type.indexOf('/') + 1)
          );
          const reader = new FileReader();
          reader.onload = () => {
            setImage(reader.result as string);
          };
          reader.readAsDataURL(clipboardItem);
        }
      }
    };

    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  if (!image) {
    return (
      <Container>
        <Stack alignSelf="center" alignItems="center" spacing={3}>
          <Logo width="40vw" style={{ minWidth: '350px', maxWidth: '600px' }} />
          <Typography fontWeight="bold" variant="h5">
            Paste image here
          </Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Container>
      <Stack
        sx={{ height: 'calc(100vh - 200px)' }}
        spacing={2}
        alignItems="center"
      >
        <img
          src={image}
          style={{ maxWidth: '80wv', maxHeight: '80vh' }}
          alt="download"
        />
        <Button variant="contained" component="label" onClick={handleDownload}>
          Download
        </Button>
      </Stack>
    </Container>
  );
};

export default DownloadImageFromClipboard;
