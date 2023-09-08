import { Figure } from './Figure';

export class Cell {
  i: number;
  j: number;
  figure: Figure | null = null;

  constructor(i: number, j: number) {
    this.i = i;
    this.j = j;
  }

  setFigure(figure: Figure) {
    this.figure = figure;
    figure.currentCell = this;
  }
}
