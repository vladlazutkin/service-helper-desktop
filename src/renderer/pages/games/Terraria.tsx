import React, { useEffect, useRef } from 'react';
import { TerrariaGame } from '../../game-rules/terraria';

const Cubello = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<TerrariaGame>();

  useEffect(() => {
    game.current = new TerrariaGame(canvasRef.current!);
    return () => {
      game.current?.unmount();
    };
  }, []);

  return (
    <div style={{ marginLeft: '10px' }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};
export default Cubello;
