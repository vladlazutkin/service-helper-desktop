import { FIGURE_COLOR, FIGURE_NAME } from '../../../interfaces';
import { FIGURE, figureImg } from '../index';
import { Figure } from './Figure';
import { Board } from './Board';
import { Cell } from './Cell';

export class Queen extends Figure {
  constructor(name: FIGURE_NAME, color: FIGURE_COLOR, board: Board) {
    super(name, color, board);
    this.img = this.getImg(
      color === FIGURE_COLOR.WHITE ? FIGURE.WHITE_QUEEN : FIGURE.BLACK_QUEEN,
      { white: figureImg.wq, black: figureImg.bq }
    );
  }

  updateImg() {
    this.img = this.getImg(
      this.color === FIGURE_COLOR.WHITE
        ? FIGURE.WHITE_QUEEN
        : FIGURE.BLACK_QUEEN,
      { white: figureImg.wq, black: figureImg.bq }
    );
  }

  canMove(cell: Cell, beat = false): boolean {
    const signI = cell.i - this.currentCell?.i!;
    const signJ = cell.j - this.currentCell?.j!;

    if (this.isStraight(signI, signJ)) {
      return this.checkStraight(signI, signJ, cell, beat);
    }

    if (!this.isDiagonal(signI, signJ)) {
      return false;
    }

    return this.checkDiagonal(signI, signJ, cell, beat);
  }

  canBeat(cell: Cell): boolean {
    return this.canMove(cell, true);
  }
}
