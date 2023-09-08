import { SapperCell } from './Cell';
import { SapperBoard } from './Board';
import { SAPPER_FIGURE_NAME } from '../../../interfaces';

export class SapperFigure {
  name: SAPPER_FIGURE_NAME;
  board: SapperBoard;
  currentCell: SapperCell | null = null;
  img: string = '';

  constructor(name: SAPPER_FIGURE_NAME, board: SapperBoard) {
    this.name = name;
    this.board = board;
  }
}
