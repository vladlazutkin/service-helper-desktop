import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import { useSocket } from '../../context/socket.context';
import { useForceUpdate } from '../../helpers/hooks/useForceUpdate';
import { FIGURE_COLOR } from '../../interfaces/games/chess';
import { isMobile } from '../../helpers/isMobile';
import { initCheckersBoard } from '../../game-rules/checkers';
import { CheckersBoard } from '../../game-rules/checkers/classes/Board';

const CELL_SIZE = isMobile() ? 45 : 80;

const buildBoard = () => {
  return Array.from({ length: 8 })
    .fill(0)
    .map((_, i) => {
      return (
        <Stack direction="row" key={`row-${i}`} className="row">
          {Array.from({ length: 8 })
            .fill(0)
            .map((_, j) => {
              return <Box className="cell" key={`cell-${i}-${j}`} />;
            })}
        </Stack>
      );
    });
};

enum PLAY_WITH {
  'AI' = 'AI',
  'USER' = 'USER',
}

const Checkers = () => {
  const boardRef = useRef<CheckersBoard>(initCheckersBoard());
  const [board, setBoard] = useState<CheckersBoard>(boardRef.current);
  const [selected, setSelected] = useState<{ i: number; j: number } | null>(
    null
  );
  const [yourColor, setColor] = useState<FIGURE_COLOR>();
  const [playWith, setPlayWith] = useState<PLAY_WITH>(PLAY_WITH.AI);
  const [isPlaying, setIsPlaying] = useState(false);

  const forceUpdate = useForceUpdate();
  const { enqueueSnackbar } = useSnackbar();
  const socket = useSocket();

  const rotateBoard = yourColor === FIGURE_COLOR.BLACK;

  const buildFigures = () => {
    const handleClick = (i: number, j: number) => {
      const emit = () => {
        socket.emit('checkers-move', {
          from: {
            ...selected,
          },
          to: {
            i,
            j,
          },
        });
      };

      if (board.getFigure(i, j)) {
        if (!selected && board.getFigureColor(i, j) !== yourColor) {
          return;
        }
        if (!selected) {
          setSelected({ i, j });
        } else if (selected.i === i && selected.j === j) {
          setSelected(null);
        } else {
          emit();
        }
      } else {
        if (selected) {
          emit();
        }
      }
    };

    return Array.from({ length: 8 })
      .fill(0)
      .map((_, i) => {
        return Array.from({ length: 8 })
          .fill(0)
          .map((_, j) => {
            const newI = rotateBoard ? 8 - i - 1 : i;
            const newJ = rotateBoard ? 8 - j - 1 : j;

            return (
              <Box
                onClick={() => handleClick(i, j)}
                sx={{
                  position: 'absolute',
                  top: newI * CELL_SIZE,
                  left: newJ * CELL_SIZE,
                  backgroundSize: 'cover',
                  border:
                    selected && selected.i === i && selected.j === j
                      ? '4px solid black'
                      : 'none',
                  backgroundImage: board.getFigure(i, j)?.img
                    ? `url(${board.getFigureImg(i, j)})`
                    : 'unset',
                }}
                className="figure"
                key={`cell-${newI}-${newJ}`}
              />
            );
          });
      });
  };

  const handlePlay = () => {
    if (playWith === PLAY_WITH.AI) {
      socket.emit('init-checkers-ai');
    } else {
      socket.emit('init-checkers');
    }
    setIsPlaying(true);
  };

  useEffect(() => {
    boardRef.current.onUpdate((newBoard) => {
      setBoard(newBoard);
      forceUpdate();
    });
    boardRef.current.onMessage((message) => {
      enqueueSnackbar(message, { variant: 'warning' });
    });
  }, []);

  useEffect(() => {
    const addListeners = () => {
      socket.on('checkers-connect', ({ color }) => {
        setColor(color);
        boardRef.current.updateMyColor(color);
      });
      socket.on('checkers-move', (data) => {
        board
          .getFigure(data.from.i, data.from.j)
          ?.moveTo(board.getCell(data.to.i, data.to.j));
        setSelected(null);
      });

      socket.on('disconnect', () => {
        enqueueSnackbar('User has left the room', { variant: 'error' });
      });
    };
    if (socket.connected) {
      addListeners();
    }
    socket.on('connect', addListeners);
  }, [socket]);

  const beatenOpponent = board.beatenFigures.filter(
    (f) => f.color !== yourColor
  );
  const beatenYour = board.beatenFigures.filter((f) => f.color === yourColor);

  if (!isPlaying) {
    return (
      <Stack
        spacing={3}
        sx={{ mx: isMobile() ? 'auto' : 5, maxWidth: '300px' }}
      >
        <InputLabel>Play with</InputLabel>
        <Select
          value={playWith}
          onChange={(e) => setPlayWith(e.target.value as PLAY_WITH)}
        >
          <MenuItem value={PLAY_WITH.AI}>AI</MenuItem>
          <MenuItem value={PLAY_WITH.USER}>Real user</MenuItem>
        </Select>
        <Button variant="contained" onClick={handlePlay}>
          Play
        </Button>
      </Stack>
    );
  }

  return (
    <Box sx={{ mx: isMobile() ? 0 : 5, maxWidth: '1200px' }}>
      <Typography sx={{ mb: 1 }} variant="h5">
        Your color: {yourColor}
      </Typography>
      <Stack sx={{ mb: 1 }} direction="row" spacing={1} alignItems="center">
        <Typography variant="h5">Turn:</Typography>
        <Typography
          sx={{
            px: '5px',
            background: board.currentColor === yourColor ? 'green' : 'grey',
          }}
          variant="h5"
        >
          {board.currentColor}
        </Typography>
      </Stack>
      <Box sx={{ minHeight: '23px' }}>
        {!!beatenYour.length && (
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              width: 'fit-content',
              mb: 2,
              ml: 3,
            }}
          >
            {beatenYour.slice(0, 1).map((f, i) => (
              <Box
                sx={{
                  backgroundSize: 'cover',
                  backgroundImage: f.img ? `url(${f.img})` : 'unset',
                  width: CELL_SIZE / 2,
                  height: CELL_SIZE / 2,
                }}
                key={i}
              />
            ))}
            x{beatenYour.length}
          </Stack>
        )}
      </Box>
      <Stack
        direction="row"
        spacing={3}
        useFlexGap
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <Stack sx={{ ml: isMobile() ? 2 : 3 }}>
          {buildBoard()}
          <Box style={{ position: 'absolute' }}>
            {nums.map((_, index) => (
              <Typography
                sx={{
                  position: 'absolute',
                  top: index * CELL_SIZE,
                  left: -CELL_SIZE / 4,
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 'bold',
                }}
                className="figure"
                key={index}
              >
                {rotateBoard ? index + 1 : 8 - index}
              </Typography>
            ))}
            {buildFigures()}
            {letters.map((l, index) => (
              <Typography
                sx={{
                  position: 'absolute',
                  top: 8 * CELL_SIZE,
                  left: index * CELL_SIZE,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
                className="figure"
                key={l}
              >
                {rotateBoard
                  ? letters[letters.length - index - 1].toUpperCase()
                  : l.toUpperCase()}
              </Typography>
            ))}
          </Box>
          <Box sx={{ mt: 3 }}>
            {!!beatenOpponent.length && (
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  width: 'fit-content',
                  mb: 2,
                }}
              >
                {beatenOpponent.slice(0, 1).map((f, i) => (
                  <Box
                    sx={{
                      backgroundSize: 'cover',
                      backgroundImage: f.img ? `url(${f.img})` : 'unset',
                      width: CELL_SIZE / 2,
                      height: CELL_SIZE / 2,
                    }}
                    key={i}
                  />
                ))}
                x{beatenOpponent.length}
              </Stack>
            )}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const nums = Array.from({ length: 8 });

export default Checkers;
