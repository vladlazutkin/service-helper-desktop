import { FIGURE_COLOR, FIGURE_NAME } from '../../../interfaces/games/chess';
import { CheckersCell } from './Cell';
import { CheckersBoard } from './Board';

export class CheckersFigure {
  name: FIGURE_NAME;
  color: FIGURE_COLOR;
  board: CheckersBoard;
  currentCell: CheckersCell | null = null;
  img: string = '';

  constructor(name: FIGURE_NAME, color: FIGURE_COLOR, board: CheckersBoard) {
    this.name = name;
    this.color = color;
    this.board = board;
  }

  canBeat(cell: CheckersCell) {
    return true;
  }

  canMove(cell: CheckersCell) {
    return true;
  }

  move(cell: CheckersCell) {
    this.currentCell!.figure = null;
    if (cell.figure) {
      this.board.addBeatenFigure(cell.figure);
    }
    cell.figure = this;
    this.currentCell = cell;
    this.board.update();
    this.onMove();
  }

  isLegalMove(cell: CheckersCell, notifications = true) {
    if (this.board.currentColor !== this.color) {
      notifications && this.board.postMessage('Not your turn');
      return false;
    }
    if (cell.figure) {
      return false;
    }
    return this.canMove(cell) || this.canBeat(cell);
  }

  moveTo(cell: CheckersCell) {
    if (!this.isLegalMove(cell)) {
      return;
    }

    this.move(cell);
  }

  onMove() {}
}
