import { FIGURE_COLOR } from '../../../interfaces';
import { CheckersCell } from './Cell';
import { CheckersFigure } from './Figure';

export class CheckersBoard {
  private cells: CheckersCell[][] = [];
  myColor: FIGURE_COLOR = FIGURE_COLOR.WHITE;
  private cbs: ((newBoard: CheckersBoard) => void)[] = [];
  private cbsMessage: ((message: string) => void)[] = [];
  currentColor: FIGURE_COLOR;
  beatenFigures: CheckersFigure[] = [];

  constructor() {
    this.currentColor = FIGURE_COLOR.WHITE;
  }

  updateMyColor(color: FIGURE_COLOR) {
    this.myColor = color;
  }

  getCells() {
    return this.cells.flat();
  }

  getCell(i: number, j: number) {
    return this.cells[i][j];
  }

  hasFigure(i: number, j: number) {
    return !!this.cells[i] && !!this.cells[i][j] && !!this.cells[i][j].figure;
  }

  getFigure(i: number, j: number) {
    if (!this.hasFigure(i, j)) {
      return null;
    }
    return this.cells[i][j].figure;
  }

  getFigureColor(i: number, j: number) {
    return this.cells[i][j].figure?.color;
  }

  getFigureImg(i: number, j: number) {
    return this.cells[i][j].figure?.img;
  }

  addBeatenFigure(figure: CheckersFigure) {
    this.beatenFigures.push(figure);
  }

  initCells() {
    for (let i = 0; i < 8; i++) {
      this.cells.push([]);
      for (let j = 0; j < 8; j++) {
        const cell = new CheckersCell(i, j);
        this.cells[i].push(cell);
      }
    }
  }

  checkForWin() {
    const canMove = (figure: CheckersFigure) => {
      return !!this.getCells().find((c) => figure.canMove(c));
    };
    const canBeat = (figure: CheckersFigure) => {
      return !!this.getCells().find((c) => figure.canBeat(c));
    };
    const winResult = (color: FIGURE_COLOR) => {
      return (
        !this.getCells().find((c) => c.figure?.color === color) ||
        (!this.getCells().find(
          (c) =>
            c.figure?.color === color &&
            (canMove(c.figure) || canBeat(c.figure))
        ) &&
          this.currentColor !== color)
      );
    };

    const whiteWin = winResult(FIGURE_COLOR.BLACK);
    const blackWin = winResult(FIGURE_COLOR.WHITE);

    return { whiteWin, blackWin };
  }

  update(changeColor = true) {
    if (changeColor) {
      this.currentColor =
        this.currentColor === FIGURE_COLOR.WHITE
          ? FIGURE_COLOR.BLACK
          : FIGURE_COLOR.WHITE;
    }
    this.cbs.forEach((cb) => cb(this));
  }

  onUpdate(cb: (newBoard: CheckersBoard) => void) {
    this.cbs.push(cb);
  }

  postMessage(message: string) {
    this.cbsMessage.forEach((cb) => cb(message));
  }

  onMessage(cb: (message: string) => void) {
    this.cbsMessage.push(cb);
  }
}
