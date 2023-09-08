import { BLOCK_BORDER_WIDTH, VIEW_HEIGHT, VIEW_WIDTH } from './constants';
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

    const size = Math.min(VIEW_WIDTH / 20, VIEW_HEIGHT / 20);
    let y = 0;
    while (y < VIEW_HEIGHT / 5) {
      let x = 0;
      while (x < VIEW_WIDTH) {
        maps.push(new MapObject(x, y, size, size));
        x += size;
      }
      y += size;
    }
    this.maps = maps;
  }

  draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
    this.maps.forEach((rect) => {
      ctx.fillStyle = 'red';
      ctx.fillRect(
        rect.left - xView - BLOCK_BORDER_WIDTH,
        rect.top - yView - BLOCK_BORDER_WIDTH,
        rect.width + BLOCK_BORDER_WIDTH * 2,
        rect.height + BLOCK_BORDER_WIDTH * 2
      );
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
