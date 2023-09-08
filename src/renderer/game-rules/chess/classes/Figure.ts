import { FIGURE_COLOR, FIGURE_NAME } from '../../../interfaces';
import { Board } from './Board';
import { Cell } from './Cell';
import { FIGURE } from '../index';
import { getImg } from '../../../helpers/getImg';

export class Figure {
  name: FIGURE_NAME;
  color: FIGURE_COLOR;
  board: Board;
  currentCell: Cell | null = null;
  img: string = '';

  constructor(name: FIGURE_NAME, color: FIGURE_COLOR, board: Board) {
    this.name = name;
    this.color = color;
    this.board = board;
  }

  updateImg() {}

  getImg(figureName: FIGURE, defaultImages: { white: string; black: string }) {
    switch (this.color) {
      case FIGURE_COLOR.WHITE:
        return this.board.config && this.board.config[figureName]
          ? getImg(this.board.config[figureName])
          : defaultImages.white;
      case FIGURE_COLOR.BLACK:
        return this.board.config && this.board.config[figureName]
          ? getImg(this.board.config[figureName])
          : defaultImages.black;
    }
  }

  canBeat(cell: Cell) {
    return true;
  }

  canMove(cell: Cell) {
    return true;
  }

  move(cell: Cell) {
    this.currentCell!.figure = null;
    if (cell.figure) {
      this.board.addBeatenFigure(cell.figure);
    }
    cell.figure = this;
    this.currentCell = cell;

    this.board.checkForCheck();
    this.board.update();
    this.onMove();
  }

  isLegalMove(cell: Cell, notifications = true) {
    if (this.board.currentColor !== this.color) {
      notifications && this.board.postMessage('Not your turn');
      return false;
    }
    if (cell.figure && this.color === cell.figure.color) {
      return false;
    }
    if (cell.figure) {
      if (!this.canBeat(cell)) {
        notifications && this.board.postMessage("You can't beat it");
        return false;
      }
    } else if (!this.canMove(cell)) {
      notifications && this.board.postMessage("You can't move here");
      return false;
    }

    return true;
  }

  moveTo(cell: Cell) {
    if (!this.isLegalMove(cell)) {
      return;
    }

    this.move(cell);
  }

  checkDiagonal(signI: number, signJ: number, cell: Cell, beat = false) {
    if (signI > 0 && signJ < 0) {
      let newI = this.currentCell?.i! + 1;
      let newJ = this.currentCell?.j! - 1;
      while (newI <= 7 && newJ >= 0) {
        if (this.board.getFigure(newI, newJ)) {
          return beat && newI === cell.i && newJ === cell.j;
        }
        if (newI === cell.i && newJ === cell.j) {
          return true;
        }
        newI++;
        newJ--;
      }
    } else if (signI > 0 && signJ > 0) {
      let newI = this.currentCell?.i! + 1;
      let newJ = this.currentCell?.j! + 1;
      while (newI <= 7 && newJ <= 7) {
        if (this.board.getFigure(newI, newJ)) {
          return beat && newI === cell.i && newJ === cell.j;
        }
        if (newI === cell.i && newJ === cell.j) {
          return true;
        }
        newI++;
        newJ++;
      }
    } else if (signI < 0 && signJ < 0) {
      let newI = this.currentCell?.i! - 1;
      let newJ = this.currentCell?.j! - 1;
      while (newI >= 0 && newJ >= 0) {
        if (this.board.getFigure(newI, newJ)) {
          return beat && newI === cell.i && newJ === cell.j;
        }
        if (newI === cell.i && newJ === cell.j) {
          return true;
        }
        newI--;
        newJ--;
      }
    } else {
      let newI = this.currentCell?.i! - 1;
      let newJ = this.currentCell?.j! + 1;
      while (newI >= 0 && newJ <= 7) {
        if (this.board.getFigure(newI, newJ)) {
          return beat && newI === cell.i && newJ === cell.j;
        }
        if (newI === cell.i && newJ === cell.j) {
          return true;
        }
        newI--;
        newJ++;
      }
    }
    return false;
  }

  checkStraight(signI: number, signJ: number, cell: Cell, beat = false) {
    if (signI === 0) {
      if (signJ > 0) {
        for (let j = this.currentCell?.j! + 1; j < 8; j++) {
          if (this.board.getFigure(this.currentCell?.i!, j)) {
            return beat && j === cell.j;
          }
          if (j === cell.j) {
            return true;
          }
        }
      } else {
        for (let j = this.currentCell?.j! - 1; j >= 0; j--) {
          if (this.board.getFigure(this.currentCell?.i!, j)) {
            return beat && j === cell.j;
          }
          if (j === cell.j) {
            return true;
          }
        }
      }
    } else {
      if (signI > 0) {
        for (let i = this.currentCell?.i! + 1; i < 8; i++) {
          if (this.board.getFigure(i, this.currentCell?.j!)) {
            return beat && i === cell.i;
          }
          if (i === cell.i) {
            return true;
          }
        }
      } else {
        for (let i = this.currentCell?.i! - 1; i >= 0; i--) {
          if (this.board.getFigure(i, this.currentCell?.j!)) {
            return beat && i === cell.i;
          }
          if (i === cell.i) {
            return true;
          }
        }
      }
    }

    return false;
  }

  isDiagonal(signI: number, signJ: number) {
    return Math.abs(signI) === Math.abs(signJ);
  }

  isStraight(signI: number, signJ: number) {
    return signI === 0 || signJ === 0;
  }

  onMove() {}
}
