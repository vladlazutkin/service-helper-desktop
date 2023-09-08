import { User } from '../index';

export enum FIGURE_NAME {
  'PAWN' = 'PAWN',
  'BISHOP' = 'BISHOP',
  'KNIGHT' = 'KNIGHT',
  'ROOK' = 'ROOK',
  'QUEEN' = 'QUEEN',
  'KING' = 'KING',
  'PIECE' = 'PIECE',
}

export enum GAME_STATUS {
  'IN_PROGRESS' = 'IN_PROGRESS',
  'GAME_DONE' = 'GAME_DONE',
}

export enum FIGURE_COLOR {
  'WHITE' = 'WHITE',
  'BLACK' = 'BLACK',
}

export interface ChessGame {
  _id: string;
  isAI: boolean;
  winner: FIGURE_COLOR;
  state: string;
  roomId: string;
}

export interface ChessSkin {
  _id: string;
  title: string;
  config: string;
  price: number;
  bought?: boolean;
}

export interface ChessConfig {
  _id: string;
  user: User;
  config: string;
  chessSkin: string;
}
