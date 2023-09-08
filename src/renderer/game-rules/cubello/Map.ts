import { VIEW_HEIGHT } from './constants';
import { Rectangle } from './Rectangle';

export class MapObject extends Rectangle {
  x: number;
  y: number;

  constructor(left: number, top: number, width: number, height: number) {
    super(left, top, width, height);
    this.x = left;
    this.y = top;
  }
}

export class GameMap {
  width: number;
  height: number;
  maps: MapObject[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  generate() {
    const maps: MapObject[] = [];

    let y = 0;
    while (y < VIEW_HEIGHT) {
      const width = 30;
      const height = 150 + Math.random() * 100;

      maps.push(new MapObject(20, VIEW_HEIGHT - y - height, width, height));
      maps.push(new MapObject(300, VIEW_HEIGHT - y - height, width, height));
      y += 250 + Math.random() * 200;
    }

    this.maps = maps;
  }

  draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
    this.maps.forEach((rect) => {
      ctx.fillStyle = '#ff8902';
      ctx.fillRect(
        rect.left - xView,
        rect.top - yView,
        rect.width,
        rect.height
      );
    });
  }
}
