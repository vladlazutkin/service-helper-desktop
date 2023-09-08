import { SapperBoard } from './Board';
import { SAPPER_FIGURE_NAME } from '../../../interfaces';
import { SapperFigure } from './Figure';
import { figureImg } from '../index';

export class Mine extends SapperFigure {
  constructor(name: SAPPER_FIGURE_NAME, board: SapperBoard) {
    super(name, board);
    this.img = figureImg.mine;
  }
}
