import { FIGURE_COLOR, FIGURE_NAME } from '../../../interfaces';
import { FIGURE, figureImg } from '../index';
import { Figure } from './Figure';
import { Board } from './Board';
import { Cell } from './Cell';

export class Pawn extends Figure {
  private firstMove = true;

  constructor(name: FIGURE_NAME, color: FIGURE_COLOR, board: Board) {
    super(name, color, board);
    this.img = this.getImg(
      color === FIGURE_COLOR.WHITE ? FIGURE.WHITE_PAWN : FIGURE.BLACK_PAWN,
      { white: figureImg.wp, black: figureImg.bp }
    );
  }

  updateImg() {
    this.img = this.getImg(
      this.color === FIGURE_COLOR.WHITE ? FIGURE.WHITE_PAWN : FIGURE.BLACK_PAWN,
      { white: figureImg.wp, black: figureImg.bp }
    );
  }

  canMove(cell: Cell): boolean {
    switch (this.color) {
      case FIGURE_COLOR.BLACK: {
        const newI = [this.currentCell?.i! + 1];
        if (
          this.firstMove &&
          !this.board.getFigure(this.currentCell?.i! + 1, cell.j)
        ) {
          newI.push(this.currentCell?.i! + 2);
        }
        return newI.includes(cell.i) && cell.j === this.currentCell?.j!;
      }
      case FIGURE_COLOR.WHITE: {
        const newI = [this.currentCell?.i! - 1];
        if (
          this.firstMove &&
          !this.board.getFigure(this.currentCell?.i! - 1, cell.j)
        ) {
          newI.push(this.currentCell?.i! - 2);
        }
        return newI.includes(cell.i) && cell.j === this.currentCell?.j!;
      }
    }
  }

  canBeat(cell: Cell): boolean {
    switch (this.color) {
      case FIGURE_COLOR.BLACK: {
        const newI = [this.currentCell?.i! + 1];
        return (
          newI.includes(cell.i) &&
          [this.currentCell?.j! - 1, this.currentCell?.j! + 1].includes(cell.j)
        );
      }
      case FIGURE_COLOR.WHITE: {
        const newI = [this.currentCell?.i! - 1];
        return (
          newI.includes(cell.i) &&
          [this.currentCell?.j! - 1, this.currentCell?.j! + 1].includes(cell.j)
        );
      }
    }
    return false;
  }

  onMove() {
    this.firstMove = false;
  }
}
