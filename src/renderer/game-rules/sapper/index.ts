import { SapperBoard } from './classes/Board';
import { Mine } from './classes/Mine';
import { SAPPER_FIGURE_NAME } from '../../interfaces';
import { getRandomInteger } from '../../helpers/getRandomInt';
import { shuffle } from '../../helpers/shuffle';

export const figureImg = {
  mine: 'https://minesweeper.online/img/skins/hd/mine.svg?v=3',
  flag: 'https://minesweeper.online/img/skins/hd/flag.svg?v=3',
  empty: 'https://minesweeper.online/img/skins/hd/closed.svg?v=3',
  type0: 'https://minesweeper.online/img/skins/hd/type0.svg?v=3',
  type1: 'https://minesweeper.online/img/skins/hd/type1.svg?v=3',
  type2: 'https://minesweeper.online/img/skins/hd/type2.svg?v=3',
  type3: 'https://minesweeper.online/img/skins/hd/type3.svg?v=3',
  type4: 'https://minesweeper.online/img/skins/hd/type4.svg?v=3',
  type5: 'https://minesweeper.online/img/skins/hd/type5.svg?v=3',
  type6: 'https://minesweeper.online/img/skins/hd/type6.svg?v=3',
  type7: 'https://minesweeper.online/img/skins/hd/type7.svg?v=3',
  type8: 'https://minesweeper.online/img/skins/hd/type8.svg?v=3',
};

export const getImgByType = (type: number) => {
  return figureImg[`type${type}` as keyof typeof figureImg];
};

export const initSapperBoard = (
  width: number,
  height: number,
  minesCount: number,
  prevBoard?: SapperBoard
) => {
  const board = prevBoard ?? new SapperBoard(width, height, minesCount);

  board.initCells();

  const allCells = Array.from({ length: height }).reduce(
    (acc: { i: number; j: number }[], _, index) => [
      ...acc,
      ...Array.from({ length: width }).map((_, ind) => ({ i: index, j: ind })),
    ],
    []
  );
  const shuffled = shuffle(allCells);
  for (let i = 0; i < Math.min(minesCount, shuffled.length); i++) {
    board
      .getCell(shuffled[i].i, shuffled[i].j)
      .setFigure(new Mine(SAPPER_FIGURE_NAME.MINE, board));
  }

  return board;
};
