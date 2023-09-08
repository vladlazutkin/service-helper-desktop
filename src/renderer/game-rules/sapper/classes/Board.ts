import { SapperCell } from './Cell';
import { SAPPER_GAME_STATUS } from '../../../interfaces';
import { initSapperBoard } from '../index';

export class SapperBoard {
  private cells: SapperCell[][] = [];
  private cbs: ((newBoard: SapperBoard) => void)[] = [];
  width: number;
  height: number;
  status: SAPPER_GAME_STATUS = SAPPER_GAME_STATUS.IN_PROGRESS;
  minesCount: number;

  constructor(width: number, height: number, minesCount: number) {
    this.width = width;
    this.height = height;
    this.minesCount = minesCount;
  }

  updateStatus(status: SAPPER_GAME_STATUS) {
    this.status = status;
    this.update();
  }

  getCell(i: number, j: number) {
    return this.cells[i][j];
  }

  hasCell(i: number, j: number) {
    return !!this.cells[i] && !!this.cells[i][j];
  }

  hasFigure(i: number, j: number) {
    return this.hasCell(i, j) && !!this.cells[i][j].figure;
  }

  getFigure(i: number, j: number) {
    if (!this.hasFigure(i, j)) {
      return null;
    }
    return this.cells[i][j].figure;
  }

  getCells() {
    return this.cells.flat();
  }

  checkForWin() {
    const win = this.getCells()
      .filter((c) => !c.isMine())
      .every((c) => c.isOpen);
    if (win) {
      this.updateStatus(SAPPER_GAME_STATUS.GAME_WIN);
      setTimeout(() => {
        alert('You win');
        this.updateStatus(SAPPER_GAME_STATUS.IN_PROGRESS);
        initSapperBoard(this.width, this.height, this.minesCount, this);
        this.update();
      }, 300);
    }
  }

  getFigureImg(i: number, j: number) {
    return this.getFigure(i, j)?.img;
  }

  getFlagsCount() {
    return this.getCells().filter((c) => c.hasFlag).length;
  }

  initCells() {
    this.cells = [];
    for (let i = 0; i < this.height; i++) {
      this.cells.push([]);
      for (let j = 0; j < this.width; j++) {
        const cell = new SapperCell(i, j, this);
        this.cells[i].push(cell);
      }
    }
  }

  update() {
    this.cbs.forEach((cb) => cb(this));
  }

  onUpdate(cb: (newBoard: SapperBoard) => void) {
    this.cbs.push(cb);
  }
}
