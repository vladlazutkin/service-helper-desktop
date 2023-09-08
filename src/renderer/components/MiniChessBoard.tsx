import React, { useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { CELL_SIZE } from '../pages/games/Chess';
import { Board } from '../game-rules/chess/classes/Board';
import { initBoard } from '../game-rules/chess';
import { useForceUpdate } from '../helpers/hooks/useForceUpdate';

interface MiniChessBoardProps {
  pieces: Record<string, string> | null;
  scale: number;
  config?: Record<string, string>;
}

const buildBoard = (scale: number) => {
  return Array.from({ length: 8 })
    .fill(0)
    .map((_, i) => {
      return (
        <Stack direction="row" key={`row-${i}`} className="row">
          {Array.from({ length: 8 })
            .fill(0)
            .map((_, j) => {
              return (
                <Box
                  className="cell"
                  sx={{ width: CELL_SIZE * scale, height: CELL_SIZE * scale }}
                  key={`cell-${i}-${j}`}
                />
              );
            })}
        </Stack>
      );
    });
};

const MiniChessBoard = ({ pieces, scale, config }: MiniChessBoardProps) => {
  const boardRef = useRef<Board>(new Board(config));
  const [board, setBoard] = useState<Board>(boardRef.current);

  const forceUpdate = useForceUpdate();

  const buildFigures = () => {
    return Array.from({ length: 8 })
      .fill(0)
      .map((_, i) => {
        return Array.from({ length: 8 })
          .fill(0)
          .map((_, j) => {
            const newI = i;
            const newJ = j;

            return (
              <Box
                sx={{
                  position: 'absolute',
                  top: newI * CELL_SIZE * scale,
                  left: newJ * CELL_SIZE * scale,
                  backgroundSize: 'cover',
                  backgroundImage: board.getFigure(i, j)?.img
                    ? `url(${board.getFigureImg(i, j)})`
                    : 'unset',
                  width: CELL_SIZE * scale,
                  height: CELL_SIZE * scale,
                }}
                className="figure"
                key={`cell-${newI}-${newJ}`}
              />
            );
          });
      });
  };

  useEffect(() => {
    boardRef.current.onUpdate((newBoard) => {
      setBoard(newBoard);
      forceUpdate();
    });
  }, []);

  useEffect(() => {
    if (pieces) {
      return boardRef.current.updatePieces(pieces);
    }
    initBoard(boardRef.current);
  }, [pieces]);

  return (
    <Stack>
      {buildBoard(scale)}
      <Box style={{ position: 'absolute' }}>{buildFigures()}</Box>
    </Stack>
  );
};

export default MiniChessBoard;
