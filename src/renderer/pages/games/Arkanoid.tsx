import React, { useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import { ArkanoidGame } from '../../game-rules/arkanoid';

const Arkanoid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<ArkanoidGame>();

  useEffect(() => {
    game.current = new ArkanoidGame(canvasRef.current!);
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
export default Arkanoid;
