import React, { useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import { CubchikGame } from '../../game-rules/cubchik';

const Cubchik = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const game = useRef<CubchikGame>();

  useEffect(() => {
    game.current = new CubchikGame(containerRef.current!);

    return () => {
      containerRef.current?.firstChild?.remove();
    };
  }, []);

  return (
    <Container>
      <div ref={containerRef}></div>
    </Container>
  );
};
export default Cubchik;
