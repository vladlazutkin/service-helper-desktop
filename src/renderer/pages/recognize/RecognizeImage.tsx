import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Cropper, { ReactCropperElement } from 'react-cropper';
import ImagesService from '../../services/ImagesService';
import { ReactComponent as Logo } from '../../assets/images/vectors/image-upload.svg';
import 'cropperjs/dist/cropper.css';

const RecognizeImage = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [response, setResponse] = useState<string>();
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dimensions, setDimensions] = useState<Cropper.CropBoxData>();

  const cropperRef = useRef<ReactCropperElement>(null);

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    setDimensions(cropper!.getCropBoxData());
  };

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

  const handleRecognize = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile!);
    formData.append('dimensions', JSON.stringify(dimensions));

    try {
      const data = await ImagesService.recognize<{ text: string }>(formData);
      setResponse(data.text);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();

      for (const clipboardItem of Array.from(e.clipboardData?.files ?? [])) {
        if (clipboardItem.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            setImage(reader.result as string);
          };
          reader.readAsDataURL(clipboardItem);

          setSelectedFile(clipboardItem);
        }
      }
    };

    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <Container>
      <Stack spacing={2} direction="column" alignItems="flex-start">
        {!selectedFile && (
          <Stack alignSelf="center" alignItems="center" spacing={3}>
            <Logo
              width="50vw"
              style={{ minWidth: '350px', maxWidth: '700px' }}
            />
            <Typography fontWeight="bold" variant="h5">
              Start with uploading a file
            </Typography>
            <Button variant="contained" component="label">
              Upload
              <input type="file" hidden onChange={onSelectFile} />
            </Button>
          </Stack>
        )}

        <Cropper
          ref={cropperRef}
          src={image}
          crop={onCrop}
          viewMode={0}
          minCropBoxHeight={50}
          minCropBoxWidth={50}
          background={false}
          zoomable={false}
        />

        {!!selectedFile && (
          <LoadingButton
            loading={loading}
            variant="contained"
            component="label"
            onClick={handleRecognize}
          >
            Recognize
          </LoadingButton>
        )}
        {!!response && <Typography mt={2}>{response}</Typography>}
      </Stack>
    </Container>
  );
};

export default RecognizeImage;
