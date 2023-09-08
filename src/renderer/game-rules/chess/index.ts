import { FIGURE_COLOR, FIGURE_NAME } from '../../interfaces/games/chess';
import { Pawn } from './classes/Pawn';
import { Rook } from './classes/Rook';
import { Bishop } from './classes/Bishop';
import { Knight } from './classes/Knight';
import { Queen } from './classes/Queen';
import { King } from './classes/King';
import { Board } from './classes/Board';

export enum FIGURE {
  WHITE_PAWN = 'P',
  WHITE_KNIGHT = 'N',
  WHITE_BISHOP = 'B',
  WHITE_ROOK = 'R',
  WHITE_QUEEN = 'Q',
  WHITE_KING = 'K',
  BLACK_PAWN = 'p',
  BLACK_KNIGHT = 'n',
  BLACK_BISHOP = 'b',
  BLACK_ROOK = 'r',
  BLACK_QUEEN = 'q',
  BLACK_KING = 'k',
}

export const figureImg = {
  wr: require('renderer/assets/images/games/chess/wr.png'),
  br: require('renderer/assets/images/games/chess/br.png'),
  wn: require('renderer/assets/images/games/chess/wn.png'),
  bn: require('renderer/assets/images/games/chess/bn.png'),
  wb: require('renderer/assets/images/games/chess/wb.png'),
  bb: require('renderer/assets/images/games/chess/bb.png'),
  wq: require('renderer/assets/images/games/chess/wq.png'),
  bq: require('renderer/assets/images/games/chess/bq.png'),
  wk: require('renderer/assets/images/games/chess/wk.png'),
  bk: require('renderer/assets/images/games/chess/bk.png'),
  wp: require('renderer/assets/images/games/chess/wp.png'),
  bp: require('renderer/assets/images/games/chess/bp.png'),
};

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export const cellMap = (i: number, j: number) => {
  const num = 8 - i;
  const letter = letters[j].toUpperCase();

  return {
    num,
    letter,
  };
};

export const revertMap = (from: string) => {
  const [letterFrom, numFrom] = Array.from(from);

  const i = 8 - +numFrom;
  const j = letters.indexOf(letterFrom.toLowerCase());

  return {
    i,
    j,
  };
};

export const initBoard = (existingBoard?: Board) => {
  const board = existingBoard ?? new Board();

  board.initCells();

  for (let j = 0; j < 8; j++) {
    board
      .getCell(6, j)
      .setFigure(new Pawn(FIGURE_NAME.PAWN, FIGURE_COLOR.WHITE, board));
  }
  for (let j = 0; j < 8; j++) {
    board
      .getCell(1, j)
      .setFigure(new Pawn(FIGURE_NAME.PAWN, FIGURE_COLOR.BLACK, board));
  }

  board
    .getCell(7, 0)
    .setFigure(new Rook(FIGURE_NAME.ROOK, FIGURE_COLOR.WHITE, board));
  board
    .getCell(7, 7)
    .setFigure(new Rook(FIGURE_NAME.ROOK, FIGURE_COLOR.WHITE, board));
  board
    .getCell(0, 0)
    .setFigure(new Rook(FIGURE_NAME.ROOK, FIGURE_COLOR.BLACK, board));
  board
    .getCell(0, 7)
    .setFigure(new Rook(FIGURE_NAME.ROOK, FIGURE_COLOR.BLACK, board));

  board
    .getCell(7, 2)
    .setFigure(new Bishop(FIGURE_NAME.BISHOP, FIGURE_COLOR.WHITE, board));
  board
    .getCell(7, 5)
    .setFigure(new Bishop(FIGURE_NAME.BISHOP, FIGURE_COLOR.WHITE, board));
  board
    .getCell(0, 2)
    .setFigure(new Bishop(FIGURE_NAME.BISHOP, FIGURE_COLOR.BLACK, board));
  board
    .getCell(0, 5)
    .setFigure(new Bishop(FIGURE_NAME.BISHOP, FIGURE_COLOR.BLACK, board));

  board
    .getCell(7, 1)
    .setFigure(new Knight(FIGURE_NAME.KNIGHT, FIGURE_COLOR.WHITE, board));
  board
    .getCell(7, 6)
    .setFigure(new Knight(FIGURE_NAME.KNIGHT, FIGURE_COLOR.WHITE, board));
  board
    .getCell(0, 1)
    .setFigure(new Knight(FIGURE_NAME.KNIGHT, FIGURE_COLOR.BLACK, board));
  board
    .getCell(0, 6)
    .setFigure(new Knight(FIGURE_NAME.KNIGHT, FIGURE_COLOR.BLACK, board));

  board
    .getCell(7, 3)
    .setFigure(new Queen(FIGURE_NAME.QUEEN, FIGURE_COLOR.WHITE, board));
  board
    .getCell(0, 3)
    .setFigure(new Queen(FIGURE_NAME.QUEEN, FIGURE_COLOR.BLACK, board));

  board
    .getCell(7, 4)
    .setFigure(new King(FIGURE_NAME.KING, FIGURE_COLOR.WHITE, board));
  board
    .getCell(0, 4)
    .setFigure(new King(FIGURE_NAME.KING, FIGURE_COLOR.BLACK, board));

  board.update(false);

  return board;
};
