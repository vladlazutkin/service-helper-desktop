import { User } from './index';

export interface TrelloBoard {
  _id: string;
  title: string;
  gridStep: number;
  columns: TrelloColumn[];
}

export interface TrelloItem {
  _id: string;
  columnName: string;
  title: string;
  description: string;
  column: TrelloColumn;
  board?: string;
  position: number;
  labels: TrelloLabel[];
  coordinates: {
    x: number;
    y: number;
  };
  to: string[];
  from: string[];
}

export interface TrelloLabel {
  _id: string;
  title: string;
  color: string;
}

export interface TrelloComment {
  _id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface TrelloColumn {
  _id: string;
  title: string;
  position: number;
  loading: boolean;
  color: string;
  cards: TrelloItem[];
}
