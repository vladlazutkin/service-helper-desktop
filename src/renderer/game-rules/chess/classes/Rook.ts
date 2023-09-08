import { FIGURE_COLOR, FIGURE_NAME } from '../../../interfaces';
import { FIGURE, figureImg } from '../index';
import { Figure } from './Figure';
import { Board } from './Board';
import { Cell } from './Cell';

export class Rook extends Figure {
  constructor(name: FIGURE_NAME, color: FIGURE_COLOR, board: Board) {
    super(name, color, board);
    this.img = this.getImg(
      color === FIGURE_COLOR.WHITE ? FIGURE.WHITE_ROOK : FIGURE.BLACK_ROOK,
      { white: figureImg.wr, black: figureImg.br }
    );
  }

  updateImg() {
    this.img = this.getImg(
      this.color === FIGURE_COLOR.WHITE ? FIGURE.WHITE_ROOK : FIGURE.BLACK_ROOK,
      { white: figureImg.wr, black: figureImg.br }
    );
  }

  canMove(cell: Cell, beat = false): boolean {
    const signI = cell.i - this.currentCell?.i!;
    const signJ = cell.j - this.currentCell?.j!;

    if (!this.isStraight(signI, signJ)) {
      return false;
    }

    return this.checkStraight(signI, signJ, cell, beat);
  }

  canBeat(cell: Cell): boolean {
    return this.canMove(cell, true);
  }
}
