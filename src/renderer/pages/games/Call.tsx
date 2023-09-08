import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { useSearchParams } from 'react-router-dom';

export const images = {
  tapok: require('renderer/assets/images/games/call/tapok.png'),
  klinMotora: require('renderer/assets/images/games/call/klin_motora.png'),
  penek: require('renderer/assets/images/games/call/penek.png'),
};

const audioCall = require('renderer/assets/audios/games/call/call_start.mp3');
const audioCallEnd = require('renderer/assets/audios/games/call/call_end.mp3');

const getImg = (from: FROM_CALL) => {
  return images[from];
};

enum FROM_CALL {
  TAPOK = 'tapok',
  KLIN = 'klinMotora',
  PENEK = 'penek',
}

const Call = () => {
  const [searchParams] = useSearchParams();

  const [isStarted, setStarted] = useState<boolean>(false);
  const [from, setFrom] = useState<FROM_CALL>(FROM_CALL.TAPOK);
  const audioRef = useRef<HTMLAudioElement>();

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(audioCall);
    audioRef.current.loop = true;
    audioRef.current.play();
    setStarted(true);
  };

  const handleClick = (e: MouseEvent<HTMLImageElement>) => {
    const rect = (e.target as HTMLImageElement).getBoundingClientRect();
    const x = e.clientX - rect.x;
    const y = e.clientY - rect.y;
    if (y / rect.height < 0.6 || y / rect.height > 0.85) {
      return;
    }

    // Accept
    if (x / rect.width > 0.65) {
      setStarted(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setTimeout(() => {
        switch (from) {
          case FROM_CALL.KLIN:
            return alert('Vash motor umer');
          case FROM_CALL.PENEK:
            return alert('V Vash motor priletel penek');
          case FROM_CALL.TAPOK:
            return alert('V Vash motor priletel tapok');
        }
      }, 300);
      // Decline
    } else if (x / rect.width < 0.3) {
      if (audioRef.current) {
        setStarted(false);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = audioCallEnd;
        audioRef.current.loop = false;
        audioRef.current.play();
      }
    }
  };

  const onMouseMove = (e: MouseEvent<HTMLImageElement>) => {
    const rect = (e.target as HTMLImageElement).getBoundingClientRect();
    const x = e.clientX - rect.x;
    const y = e.clientY - rect.y;
    if (y / rect.height < 0.6 || y / rect.height > 0.85) {
      (e.target as HTMLImageElement).style.cursor = 'initial';
      return;
    }
    if (x / rect.width > 0.65 || x / rect.width < 0.3) {
      (e.target as HTMLImageElement).style.cursor = 'pointer';
    } else {
      (e.target as HTMLImageElement).style.cursor = 'initial';
    }
  };

  const img = getImg(from);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (
      searchParams.get('from') &&
      Object.values(FROM_CALL).find((v) => v === searchParams.get('from'))
    ) {
      setFrom(searchParams.get('from') as FROM_CALL);
      handleStart();
    }
  }, []);

  if (!isStarted) {
    return (
      <Container>
        <Stack
          spacing={2}
          sx={{ height: 'calc(100vh - 200px)' }}
          alignItems="center"
          justifyContent="center"
        >
          <Box>
            <InputLabel>Call from</InputLabel>
            <Select
              value={from}
              onChange={(e) => setFrom(e.target.value as FROM_CALL)}
            >
              <MenuItem value={FROM_CALL.TAPOK}>Tapok</MenuItem>
              <MenuItem value={FROM_CALL.PENEK}>Penek</MenuItem>
              <MenuItem value={FROM_CALL.KLIN}>Klin Motora</MenuItem>
            </Select>
          </Box>
          <Button variant="contained" onClick={handleStart}>
            Call
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container>
      <Stack sx={{ mt: 10 }} alignItems="center" justifyContent="center">
        <div className="call-img-container">
          <img
            className="call-img"
            onMouseMove={onMouseMove}
            onMouseLeave={(e) =>
              ((e.target as HTMLImageElement).style.cursor = 'initial')
            }
            onClick={handleClick}
            style={{ maxWidth: '60wv', maxHeight: '80vh' }}
            src={img}
            alt="call"
          />
        </div>
      </Stack>
    </Container>
  );
};
export default Call;
