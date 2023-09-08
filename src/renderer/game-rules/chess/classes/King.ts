import { FIGURE_COLOR, FIGURE_NAME } from '../../../interfaces';
import { FIGURE, figureImg } from '../index';
import { Board } from './Board';
import { Figure } from './Figure';
import { Cell } from './Cell';

export class King extends Figure {
  constructor(name: FIGURE_NAME, color: FIGURE_COLOR, board: Board) {
    super(name, color, board);
    this.img = this.getImg(
      color === FIGURE_COLOR.WHITE ? FIGURE.WHITE_KING : FIGURE.BLACK_KING,
      { white: figureImg.wk, black: figureImg.bk }
    );
  }

  updateImg() {
    this.img = this.getImg(
      this.color === FIGURE_COLOR.WHITE ? FIGURE.WHITE_KING : FIGURE.BLACK_KING,
      { white: figureImg.wk, black: figureImg.bk }
    );
  }

  canMove(cell: Cell): boolean {
    const diffI = Math.abs(cell.i - this.currentCell?.i!);
    const diffJ = Math.abs(cell.j - this.currentCell?.j!);

    if (diffI === diffJ) {
      return diffI + diffI === 2;
    }
    return diffI + diffJ === 1;
  }

  canBeat(cell: Cell): boolean {
    return this.canMove(cell);
  }
}
