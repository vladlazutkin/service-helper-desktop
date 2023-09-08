import { FIGURE_COLOR, FIGURE_NAME } from '../../../interfaces';
import { FIGURE, figureImg } from '../index';
import { Figure } from './Figure';
import { Board } from './Board';
import { Cell } from './Cell';

export class Knight extends Figure {
  constructor(name: FIGURE_NAME, color: FIGURE_COLOR, board: Board) {
    super(name, color, board);
    this.img = this.getImg(
      color === FIGURE_COLOR.WHITE ? FIGURE.WHITE_KNIGHT : FIGURE.BLACK_KNIGHT,
      { white: figureImg.wn, black: figureImg.bn }
    );
  }

  updateImg() {
    this.img = this.getImg(
      this.color === FIGURE_COLOR.WHITE
        ? FIGURE.WHITE_KNIGHT
        : FIGURE.BLACK_KNIGHT,
      { white: figureImg.wn, black: figureImg.bn }
    );
  }

  canMove(cell: Cell): boolean {
    const diffI = Math.abs(cell.i - this.currentCell?.i!);
    const diffJ = Math.abs(cell.j - this.currentCell?.j!);

    return (diffI === 1 && diffJ === 2) || (diffI === 2 && diffJ === 1);
  }

  canBeat(cell: Cell): boolean {
    return this.canMove(cell);
  }
}
