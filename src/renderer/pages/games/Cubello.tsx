import React, { useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import { CubelloGame } from '../../game-rules/cubello';

const Cubello = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<CubelloGame>();

  useEffect(() => {
    game.current = new CubelloGame(canvasRef.current!);
    return () => {
      game.current?.unmount();
    };
  }, []);

  return (
    <Container>
      <canvas ref={canvasRef}></canvas>
    </Container>
  );
};
export default Cubello;
