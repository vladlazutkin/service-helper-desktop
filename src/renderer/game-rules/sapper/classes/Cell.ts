import { SapperFigure } from './Figure';
import { SapperBoard } from './Board';
import { Mine } from './Mine';

export class SapperCell {
  i: number;
  j: number;
  figure: SapperFigure | null = null;
  hasFlag: boolean = false;
  board: SapperBoard;
  isOpen: boolean = false;

  constructor(i: number, j: number, board: SapperBoard) {
    this.i = i;
    this.j = j;
    this.board = board;
  }

  isMine() {
    return this?.figure instanceof Mine;
  }

  isClear() {
    return !this.getMinesCount();
  }

  getMinesCount() {
    let cnt = 0;
    for (let i = this.i - 1; i <= this.i + 1; i++) {
      for (let j = this.j - 1; j <= this.j + 1; j++) {
        if (this.board.hasCell(i, j) && this.board.getCell(i, j).isMine()) {
          cnt++;
        }
      }
    }
    return cnt;
  }

  switchFlag() {
    this.hasFlag = !this.hasFlag;
    this.board.update();
  }

  setFigure(figure: SapperFigure) {
    this.figure = figure;
    figure.currentCell = this;
  }

  recursiveOpen(i: number, j: number) {
    for (let ii = i - 1; ii <= i + 1; ii++) {
      for (let jj = j - 1; jj <= j + 1; jj++) {
        if (this.board.hasCell(ii, jj) && !this.board.getCell(ii, jj).isOpen) {
          setTimeout(() => this.board.getCell(ii, jj).handleOpen(), 100);
        }
      }
    }
  }

  handleOpen() {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;
    if (this.isClear()) {
      this.recursiveOpen(this.i, this.j);
    }
    this.board.update();
    this.board.checkForWin();
  }
}
