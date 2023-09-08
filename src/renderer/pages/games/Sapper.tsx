import React, { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import { useForceUpdate } from '../../helpers/hooks/useForceUpdate';
import { isMobile } from '../../helpers/isMobile';
import TextField from '@mui/material/TextField';
import { SapperBoard } from '../../game-rules/sapper/classes/Board';
import {
  figureImg,
  getImgByType,
  initSapperBoard,
} from '../../game-rules/sapper';
import { SAPPER_GAME_STATUS } from '../../interfaces';
import Typography from '@mui/material/Typography';
import { formatTime } from '../../helpers/formatTime';

const Sapper = () => {
  const [minesCount, setMinesCount] = useState<number>(20);
  const [width, setWidth] = useState<number>(10);
  const [height, setHeight] = useState<number>(10);
  const [timer, setTimer] = useState<number>(0);
  const interval = useRef<number>();
  const [pressed, setPressed] = useState<boolean>(false);

  const [board, setBoard] = useState<SapperBoard>(() =>
    initSapperBoard(width, height, minesCount)
  );

  const forceUpdate = useForceUpdate();

  const CELL_SIZE = useMemo(() => {
    return Math.min(
      (window.innerHeight - 200) / board.height,
      (window.innerWidth - 15) / board.width
    );
  }, [board]);

  const buildBoard = () => {
    return Array.from({ length: board.height }).map((_, i) => {
      return (
        <Stack direction="row" key={`row-${i}`} className="row">
          {Array.from({ length: board.width })
            .fill(0)
            .map((_, j) => {
              return (
                <Box
                  className="sapper-cell"
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}
                  key={`cell-${i}-${j}`}
                />
              );
            })}
        </Stack>
      );
    });
  };

  const startTimer = () => {
    if (interval.current) {
      return;
    }
    setTimer(0);
    interval.current = window.setInterval(
      () => setTimer((prev) => prev + 1),
      1000
    );
  };

  const buildFigures = () => {
    const handleClick = (i: number, j: number) => {
      if (
        [SAPPER_GAME_STATUS.GAME_WIN, SAPPER_GAME_STATUS.GAME_LOSE].includes(
          board.status
        )
      ) {
        return;
      }
      startTimer();
      if (board.getCell(i, j).isMine()) {
        board.updateStatus(SAPPER_GAME_STATUS.GAME_LOSE);
        return setTimeout(() => {
          alert('Game over');
          handleUpdate();
        }, 300);
      }
      board.getCell(i, j).handleOpen();
    };

    const handleRightClick = (i: number, j: number) => {
      if (
        [SAPPER_GAME_STATUS.GAME_WIN, SAPPER_GAME_STATUS.GAME_LOSE].includes(
          board.status
        )
      ) {
        return;
      }
      startTimer();
      board.getCell(i, j).switchFlag();
    };

    return Array.from({ length: board.height })
      .fill(0)
      .map((_, i) => {
        return Array.from({ length: board.width })
          .fill(0)
          .map((_, j) => {
            const getImg = () => {
              if (
                board.getCell(i, j).hasFlag &&
                !board.getCell(i, j).isOpen &&
                board.status === SAPPER_GAME_STATUS.IN_PROGRESS
              ) {
                return `url(${figureImg.flag})`;
              }
              if (
                board.getFigure(i, j)?.img &&
                [
                  SAPPER_GAME_STATUS.GAME_WIN,
                  SAPPER_GAME_STATUS.GAME_LOSE,
                ].includes(board.status)
              ) {
                return `url(${board.getFigureImg(i, j)})`;
              }
              if (board.getCell(i, j).isOpen) {
                const minesCnt = board.getCell(i, j).getMinesCount();

                return `url(${getImgByType(minesCnt)})`;
              }
              return `url(${figureImg.empty})`;
            };
            const img = getImg();

            return (
              <Box
                onClick={() => handleClick(i, j)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleRightClick(i, j);
                }}
                sx={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  position: 'absolute',
                  top: i * CELL_SIZE,
                  left: j * CELL_SIZE,
                  backgroundSize: 'cover',
                  backgroundImage: img,
                }}
                className="sapper-figure"
                key={`cell-${i}-${j}`}
              />
            );
          });
      });
  };

  const handleUpdate = () => {
    const newBoard = initSapperBoard(width, height, minesCount);
    setBoard(newBoard);
    newBoard.onUpdate((newBoard) => {
      setBoard(newBoard);
      forceUpdate();
    });
  };

  const faceSrc =
    board.status === SAPPER_GAME_STATUS.GAME_LOSE
      ? 'https://minesweeper.online/img/skins/hd/face_lose.svg?v=3'
      : board.status === SAPPER_GAME_STATUS.GAME_WIN
      ? 'https://minesweeper.online/img/skins/hd/face_win.svg?v=3'
      : pressed
      ? 'https://minesweeper.online/img/skins/hd/face_pressed.svg?v=3'
      : 'https://minesweeper.online/img/skins/hd/face_unpressed.svg?v=3';

  useEffect(() => {
    board.onUpdate((newBoard) => {
      setBoard(newBoard);
      forceUpdate();
    });
  }, []);

  useEffect(() => {
    if (
      [SAPPER_GAME_STATUS.GAME_WIN, SAPPER_GAME_STATUS.GAME_LOSE].includes(
        board.status
      )
    ) {
      clearInterval(interval.current);
      interval.current = 0;
    }
  }, [board.status]);

  return (
    <Box sx={{ mx: isMobile() ? 1 : 5, maxWidth: '1200px' }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ width: board.width * CELL_SIZE }}
      >
        <Stack sx={{ flex: 1 }}>
          <InputLabel>Mines</InputLabel>
          <TextField
            type="number"
            value={minesCount}
            variant="outlined"
            onChange={(e) => setMinesCount(+e.target.value)}
          />
        </Stack>
        <Stack sx={{ flex: 1 }}>
          <InputLabel>Width</InputLabel>
          <TextField
            value={width}
            type="number"
            variant="outlined"
            onChange={(e) => setWidth(+e.target.value)}
          />
        </Stack>
        <Stack sx={{ flex: 1 }}>
          <InputLabel>Height</InputLabel>
          <TextField
            value={height}
            type="number"
            variant="outlined"
            onChange={(e) => setHeight(+e.target.value)}
          />
        </Stack>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ mt: 1, width: board.width * CELL_SIZE }}
      >
        <Typography fontWeight="bold" variant="h3">
          {board.minesCount - board.getFlagsCount()}
        </Typography>
        <img
          src={figureImg.flag}
          alt="flags"
          style={{
            cursor: 'pointer',
            width: '64px',
            height: '64px',
          }}
        />
        <img
          onClick={() => {
            clearInterval(interval.current);
            interval.current = 0;
            setTimer(0);
            handleUpdate();
          }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setTimeout(() => setPressed(false), 100)}
          style={{
            cursor: 'pointer',
            width: '64px',
            height: '64px',
          }}
          src={faceSrc}
          alt="update"
        />
        <Typography fontWeight="bold" variant="h3">
          {formatTime(timer)}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        spacing={3}
        useFlexGap
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <Stack mt={1}>
          {buildBoard()}
          <Box style={{ position: 'absolute' }}>{buildFigures()}</Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Sapper;
