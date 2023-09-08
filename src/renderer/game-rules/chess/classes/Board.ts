import { Cell } from './Cell';
import { FIGURE_COLOR, FIGURE_NAME, GAME_STATUS } from '../../../interfaces';
import { Figure } from './Figure';
import { Pawn } from './Pawn';
import { Knight } from './Knight';
import { Bishop } from './Bishop';
import { Rook } from './Rook';
import { Queen } from './Queen';
import { King } from './King';
import { revertMap } from '../index';

export class Board {
  private cells: Cell[][] = [];
  private cbs: ((newBoard: Board) => void)[] = [];
  private cbsMessage: ((message: string) => void)[] = [];
  status: GAME_STATUS;
  currentColor: FIGURE_COLOR;
  checkMate: FIGURE_COLOR | null = null;
  beatenFigures: Figure[] = [];
  config: Record<string, string> | null = null;

  constructor(config: Record<string, string> | null = null) {
    this.currentColor = FIGURE_COLOR.WHITE;
    this.config = config;
    this.status = GAME_STATUS.IN_PROGRESS;
  }

  updateStatus(status: GAME_STATUS) {
    this.status = status;
  }

  updateConfig(config: Record<string, string>) {
    this.config = config;
    this.getCells().forEach((c) => c.figure?.updateImg());
    this.update(false);
  }

  updatePieces(pieces: Record<string, string>) {
    const piecesMap = new Map<string, () => Figure>([
      ['P', () => new Pawn(FIGURE_NAME.PAWN, FIGURE_COLOR.WHITE, this)],
      ['N', () => new Knight(FIGURE_NAME.KNIGHT, FIGURE_COLOR.WHITE, this)],
      ['B', () => new Bishop(FIGURE_NAME.BISHOP, FIGURE_COLOR.WHITE, this)],
      ['R', () => new Rook(FIGURE_NAME.ROOK, FIGURE_COLOR.WHITE, this)],
      ['Q', () => new Queen(FIGURE_NAME.QUEEN, FIGURE_COLOR.WHITE, this)],
      ['K', () => new King(FIGURE_NAME.KING, FIGURE_COLOR.WHITE, this)],
      ['p', () => new Pawn(FIGURE_NAME.PAWN, FIGURE_COLOR.BLACK, this)],
      ['n', () => new Knight(FIGURE_NAME.KNIGHT, FIGURE_COLOR.BLACK, this)],
      ['b', () => new Bishop(FIGURE_NAME.BISHOP, FIGURE_COLOR.BLACK, this)],
      ['r', () => new Rook(FIGURE_NAME.ROOK, FIGURE_COLOR.BLACK, this)],
      ['q', () => new Queen(FIGURE_NAME.QUEEN, FIGURE_COLOR.BLACK, this)],
      ['k', () => new King(FIGURE_NAME.KING, FIGURE_COLOR.BLACK, this)],
    ]);

    this.initCells();

    Object.entries(pieces).forEach(([key, name]) => {
      const { i, j } = revertMap(key);
      const figure = piecesMap.get(name)?.();
      this.getCell(i, j).setFigure(figure!);
    });

    this.checkForCheck();
    this.update(false);
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

  addBeatenFigure(figure: Figure) {
    this.beatenFigures.push(figure);
  }

  initCells() {
    this.cells = [];
    for (let i = 0; i < 8; i++) {
      this.cells.push([]);
      for (let j = 0; j < 8; j++) {
        const cell = new Cell(i, j);
        this.cells[i].push(cell);
      }
    }
  }

  checkForCheck() {
    const cells = this.getCells();
    const whiteKing = cells.find(
      (c) =>
        c.figure?.color === FIGURE_COLOR.WHITE &&
        c.figure.name === FIGURE_NAME.KING
    );
    const blackKing = cells.find(
      (c) =>
        c.figure?.color === FIGURE_COLOR.BLACK &&
        c.figure.name === FIGURE_NAME.KING
    );
    const whiteHasCheckMate = cells
      .filter((c) => c.figure?.color === FIGURE_COLOR.BLACK)
      .find((c) => c.figure?.canBeat(whiteKing!));
    const blackHasCheckMate = cells
      .filter((c) => c.figure?.color === FIGURE_COLOR.WHITE)
      .find((c) => c.figure?.canBeat(blackKing!));

    this.checkMate = whiteHasCheckMate
      ? FIGURE_COLOR.WHITE
      : blackHasCheckMate
      ? FIGURE_COLOR.BLACK
      : null;
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

  onUpdate(cb: (newBoard: Board) => void) {
    this.cbs.push(cb);
  }

  postMessage(message: string) {
    this.cbsMessage.forEach((cb) => cb(message));
  }

  onMessage(cb: (message: string) => void) {
    this.cbsMessage.push(cb);
  }
}
