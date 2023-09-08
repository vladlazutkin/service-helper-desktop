import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import IconButton from '@mui/material/IconButton';
import { formatTime } from '../helpers/formatTime';
import { ReactComponent as Logo } from '../assets/images/vectors/image-upload.svg';
import { AudioController } from '../helpers/audio';

const AudioTune = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const { current: audioController } = useRef(
    new AudioController({ volume: 0.5 })
  );

  const [duration, setDuration] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [frequency, setFrequency] = useState<number>(440);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [speed, setSpeed] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.5);

  const { enqueueSnackbar } = useSnackbar();

  const proceed = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      audioController.ctx
        .decodeAudioData(reader.result as ArrayBuffer)
        .then((audioBuffer) => {
          setSelectedFile(file);
          audioController.init(audioBuffer);
          setDuration(audioBuffer.duration);

          audioController.onPlayPauseChange((isPlaying) => {
            setIsPlaying(isPlaying);
          });
          audioController.onPlaybackTimeChange((time) => {
            setTime(time);
          });
        })
        .catch(() =>
          enqueueSnackbar('Something went wrong', { variant: 'error' })
        );
    };
    reader.readAsArrayBuffer(file);
  };

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return setSelectedFile(undefined);
    }
    const file = e.target.files[0];

    proceed(file);
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();

      for (const clipboardItem of Array.from(e.clipboardData?.files ?? [])) {
        if (clipboardItem.type.startsWith('audio/')) {
          proceed(clipboardItem);
        }
      }
    };

    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <Container sx={{ position: 'relative' }}>
      {!selectedFile && (
        <Stack alignSelf="center" alignItems="center" spacing={3}>
          <Logo width="50vw" style={{ minWidth: '350px', maxWidth: '700px' }} />
          <Typography fontWeight="bold" variant="h5">
            Start with uploading a file
          </Typography>
          <Button variant="contained" component="label">
            Upload
            <input type="file" hidden onChange={onSelectFile} />
          </Button>
        </Stack>
      )}
      {!!selectedFile && (
        <Stack alignItems="center" sx={{ mt: '40vh' }}>
          <Stack width="100%">
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1" color="text.secondary">
                Speed
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {Math.round(speed * 100)}%
              </Typography>
            </Stack>
            <Slider
              value={speed}
              max={2}
              min={0.1}
              step={0.01}
              onChange={(_, value) => {
                audioController.changePlaybackRate(value as number);
                setSpeed(value as number);
              }}
              color="secondary"
            />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1" color="text.secondary">
                Volume
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {Math.round(volume * 100)}%
              </Typography>
            </Stack>
            <Slider
              value={volume}
              max={1}
              step={0.01}
              onChange={(_, value) => {
                setVolume(value as number);
                audioController.changeVolume(value as number);
              }}
              color="secondary"
            />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1" color="text.secondary">
                Frequency
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {Math.round(frequency)}HZ
              </Typography>
            </Stack>
            <Slider
              value={frequency}
              max={2000}
              min={100}
              onChange={(_, value) => {
                setFrequency(value as number);
                audioController.changeFrequency(value as number);
              }}
              color="secondary"
            />
          </Stack>
          <Stack
            sx={{
              position: 'fixed',
              bottom: 0,
              py: 2,
              px: 2,
              backgroundColor: 'rgba(0,0,0,.2)',
            }}
            alignItems="center"
            width="100%"
          >
            <Stack
              sx={{
                maxWidth: '1200px',
              }}
              alignItems="center"
              width="100%"
            >
              <Stack
                width="100%"
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Typography>{formatTime(time)}</Typography>
                <Slider
                  value={time}
                  max={duration}
                  onChange={(_, value) => {
                    audioController.seek(value as number);
                    setTime(value as number);
                  }}
                  color="secondary"
                />
                <Typography>{formatTime(duration)}</Typography>
              </Stack>
              <IconButton
                onClick={() => audioController.pauseOrResume()}
                sx={{ width: '64px', height: '64px' }}
              >
                {isPlaying ? (
                  <PauseCircleIcon sx={{ width: '64px', height: '64px' }} />
                ) : (
                  <PlayCircleIcon sx={{ width: '64px', height: '64px' }} />
                )}
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Container>
  );
};

export default AudioTune;
