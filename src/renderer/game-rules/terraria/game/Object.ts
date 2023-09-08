import { Rectangle } from './Rectangle';

export class Object {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  intersects(x: number, y: number) {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }

  intersectsRect(rect: Rectangle) {
    return !(
      this.x + this.width < rect.left ||
      rect.right < this.x ||
      this.y + this.height < rect.top ||
      rect.bottom < this.y
    );
  }
}
